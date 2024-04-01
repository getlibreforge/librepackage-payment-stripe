import 'reflect-metadata';
import { injectable } from 'inversify';
import { loadStripe } from '@stripe/stripe-js';
import { AbstractAction, ActionExecutionContext } from '@libreforge/libreforge-framework';

const ARG_SESSION_ID_ATTRIBUTE = "sessionId";

@injectable()
export class RouteToStripeCheckoutAction extends AbstractAction {

  name = 'RouteToStripeCheckout';

  getName() {
    return this.name;
  }

  async execute(context: ActionExecutionContext): Promise<{ next: boolean, result: any }> {

    const { args, prevExecutionState  } = context;
    console.warn(`${this.name} called`);

    const sessionIdAttribute = args[ARG_SESSION_ID_ATTRIBUTE];
    if (!sessionIdAttribute) {
      console.error(`${this.name} > ${ARG_SESSION_ID_ATTRIBUTE} argument not provided`);
      return { next: false, result: undefined };
    }

    /* Redirect to Stripe Checkout page */
    //@ts-ignore
    const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
    if (!stripe) {
      console.error("Can't init Stripe library");
      return { next: false, result: {} };
    }

    const sessionId = prevExecutionState?.data[sessionIdAttribute];
    console.log(`SessionId to redirect to - ${sessionId}`);


    const { error } = await stripe.redirectToCheckout({ sessionId });
    console.warn(error.message);

    return { next: true, result: {} };
  }

  override getArgsDefinition(): { name: string; type: string; label: string }[] {
    return [
      { name: ARG_SESSION_ID_ATTRIBUTE, type: "string", label: "SessionId Response Attr" }
    ];
  };  
}