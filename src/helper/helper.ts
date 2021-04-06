import { runHelper } from './run-helper';
import { HiveHelpOptions, HiveHelpSettings } from './types/hive-help';
import { hiveHelpDefaults } from './constants/hive-help-defaults';

/**
 *
 * @param options Options for the hiveHelp method
 */
export async function hiveHelp(options: HiveHelpOptions) {
  const settings: HiveHelpSettings = {
    ...hiveHelpDefaults,
    ...options
  }
  return await runHelper(settings.gpu, settings.url, settings.logFunction);
}
