import { EnvService } from "../services/environment/env.service";

/**
 * Factory function to create an instance of EnvService.
 *
 * This function creates a new instance of EnvService and sets the environment
 * based on the current hostname.
 *
 * @example
 * const envService = EnvServiceFactory();
 * console.log(envService.env); // Output: "prod" or "local" or "dev" or "uat" or "training"
 */
export const EnvServiceFactory = () => {
  // Create env
  const env = new EnvService();

  const envPrefix = window.location.host.split(/[.]/)[0].split(/[-]/)[0];

  if (envPrefix === 'local' || envPrefix === 'dev' || envPrefix === 'uat' || envPrefix === 'training') {
    env['env'] = envPrefix;
  } else {
    env['env'] = 'prod';
  }

  return env;
};

/**
 * Provider for EnvService.
 *
 * This provider uses the EnvServiceFactory to create an instance of EnvService.
 *
 * @example
 * @NgModule({
 *   providers: [EnvServiceProvider],
 * })
 * export class AppModule {}
 */
export const EnvServiceProvider = {
  /**
   * The token to provide.
   */
  provide: EnvService,

  /**
   * The factory function to create the instance.
   */
  useFactory: EnvServiceFactory,

  /**
   * The dependencies required by the factory function.
   */
  deps: [],
};