[esp32-javascript](../README.md) › ["esp32-javascript/modules/esp32-javascript/filelogging"](_esp32_javascript_modules_esp32_javascript_filelogging_.md)

# Module: "esp32-javascript/modules/esp32-javascript/filelogging"

## Index

### Variables

* [FILE_LOGGING_DIRECTORY](_esp32_javascript_modules_esp32_javascript_filelogging_.md#const-file_logging_directory)
* [LOG_FILE_NUM_LIMIT](_esp32_javascript_modules_esp32_javascript_filelogging_.md#const-log_file_num_limit)
* [LOG_FILE_SIZE_LIMIT](_esp32_javascript_modules_esp32_javascript_filelogging_.md#const-log_file_size_limit)
* [NUMBER_PREFIX](_esp32_javascript_modules_esp32_javascript_filelogging_.md#const-number_prefix)
* [TDIWEF](_esp32_javascript_modules_esp32_javascript_filelogging_.md#const-tdiwef)
* [logFileNumber](_esp32_javascript_modules_esp32_javascript_filelogging_.md#let-logfilenumber)

### Functions

* [cleanupOldLogs](_esp32_javascript_modules_esp32_javascript_filelogging_.md#cleanupoldlogs)
* [getLogFileNumber](_esp32_javascript_modules_esp32_javascript_filelogging_.md#getlogfilenumber)

## Variables

### `Const` FILE_LOGGING_DIRECTORY

• **FILE_LOGGING_DIRECTORY**: *"/data/logs"* = "/data/logs"

*Defined in [esp32-javascript/modules/esp32-javascript/filelogging.ts:26](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/filelogging.ts#L26)*

___

### `Const` LOG_FILE_NUM_LIMIT

• **LOG_FILE_NUM_LIMIT**: *8* = 8

*Defined in [esp32-javascript/modules/esp32-javascript/filelogging.ts:28](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/filelogging.ts#L28)*

___

### `Const` LOG_FILE_SIZE_LIMIT

• **LOG_FILE_SIZE_LIMIT**: *10240* = 10240

*Defined in [esp32-javascript/modules/esp32-javascript/filelogging.ts:27](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/filelogging.ts#L27)*

___

### `Const` NUMBER_PREFIX

• **NUMBER_PREFIX**: *"00000000"* = "00000000"

*Defined in [esp32-javascript/modules/esp32-javascript/filelogging.ts:31](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/filelogging.ts#L31)*

___

### `Const` TDIWEF

• **TDIWEF**: *"TDIWEF"* = "TDIWEF"

*Defined in [esp32-javascript/modules/esp32-javascript/filelogging.ts:30](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/filelogging.ts#L30)*

___

### `Let` logFileNumber

• **logFileNumber**: *number* = -1

*Defined in [esp32-javascript/modules/esp32-javascript/filelogging.ts:32](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/filelogging.ts#L32)*

## Functions

###  cleanupOldLogs

▸ **cleanupOldLogs**(): *void*

*Defined in [esp32-javascript/modules/esp32-javascript/filelogging.ts:50](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/filelogging.ts#L50)*

**Returns:** *void*

___

###  getLogFileNumber

▸ **getLogFileNumber**(): *string*

*Defined in [esp32-javascript/modules/esp32-javascript/filelogging.ts:34](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/filelogging.ts#L34)*

**Returns:** *string*
