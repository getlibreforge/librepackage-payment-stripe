import { AbstractAction, SYMBOL_ACTION_PROVIDER } from '@libreforge/libreforge-framework';
import { Container } from 'inversify';
import { RouteToStripeCheckoutAction } from './payment/stripe';

export function bindProviders(container: Container) {
  container.bind<AbstractAction>(SYMBOL_ACTION_PROVIDER).to(RouteToStripeCheckoutAction);
}
