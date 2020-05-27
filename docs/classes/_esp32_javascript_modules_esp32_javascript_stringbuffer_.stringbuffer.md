[esp32-javascript](../README.md) › ["esp32-javascript/modules/esp32-javascript/stringbuffer"](../modules/_esp32_javascript_modules_esp32_javascript_stringbuffer_.md) › [StringBuffer](_esp32_javascript_modules_esp32_javascript_stringbuffer_.stringbuffer.md)

# Class: StringBuffer

## Hierarchy

* **StringBuffer**

## Index

### Constructors

* [constructor](_esp32_javascript_modules_esp32_javascript_stringbuffer_.stringbuffer.md#constructor)

### Properties

* [content](_esp32_javascript_modules_esp32_javascript_stringbuffer_.stringbuffer.md#private-content)
* [length](_esp32_javascript_modules_esp32_javascript_stringbuffer_.stringbuffer.md#length)

### Methods

* [append](_esp32_javascript_modules_esp32_javascript_stringbuffer_.stringbuffer.md#append)
* [indexOf](_esp32_javascript_modules_esp32_javascript_stringbuffer_.stringbuffer.md#indexof)
* [substr](_esp32_javascript_modules_esp32_javascript_stringbuffer_.stringbuffer.md#substr)
* [substring](_esp32_javascript_modules_esp32_javascript_stringbuffer_.stringbuffer.md#substring)
* [toLowerCase](_esp32_javascript_modules_esp32_javascript_stringbuffer_.stringbuffer.md#tolowercase)
* [toString](_esp32_javascript_modules_esp32_javascript_stringbuffer_.stringbuffer.md#tostring)
* [toUpperCase](_esp32_javascript_modules_esp32_javascript_stringbuffer_.stringbuffer.md#touppercase)

## Constructors

###  constructor

\+ **new StringBuffer**(): *[StringBuffer](_esp32_javascript_modules_esp32_javascript_stringbuffer_.stringbuffer.md)*

*Defined in [esp32-javascript/modules/esp32-javascript/stringbuffer.ts:3](https://github.com/marcelkottmann/esp32-javascript/blob/2b53f2e/components/esp32-javascript/modules/esp32-javascript/stringbuffer.ts#L3)*

**Returns:** *[StringBuffer](_esp32_javascript_modules_esp32_javascript_stringbuffer_.stringbuffer.md)*

## Properties

### `Private` content

• **content**: *string[]*

*Defined in [esp32-javascript/modules/esp32-javascript/stringbuffer.ts:2](https://github.com/marcelkottmann/esp32-javascript/blob/2b53f2e/components/esp32-javascript/modules/esp32-javascript/stringbuffer.ts#L2)*

___

###  length

• **length**: *number*

*Defined in [esp32-javascript/modules/esp32-javascript/stringbuffer.ts:3](https://github.com/marcelkottmann/esp32-javascript/blob/2b53f2e/components/esp32-javascript/modules/esp32-javascript/stringbuffer.ts#L3)*

## Methods

###  append

▸ **append**(`s`: [StringBuffer](_esp32_javascript_modules_esp32_javascript_stringbuffer_.stringbuffer.md) | string): *this*

*Defined in [esp32-javascript/modules/esp32-javascript/stringbuffer.ts:31](https://github.com/marcelkottmann/esp32-javascript/blob/2b53f2e/components/esp32-javascript/modules/esp32-javascript/stringbuffer.ts#L31)*

**Parameters:**

Name | Type |
------ | ------ |
`s` | [StringBuffer](_esp32_javascript_modules_esp32_javascript_stringbuffer_.stringbuffer.md) &#124; string |

**Returns:** *this*

___

###  indexOf

▸ **indexOf**(`searchString`: string, `position?`: undefined | number): *number*

*Defined in [esp32-javascript/modules/esp32-javascript/stringbuffer.ts:10](https://github.com/marcelkottmann/esp32-javascript/blob/2b53f2e/components/esp32-javascript/modules/esp32-javascript/stringbuffer.ts#L10)*

**Parameters:**

Name | Type |
------ | ------ |
`searchString` | string |
`position?` | undefined &#124; number |

**Returns:** *number*

___

###  substr

▸ **substr**(`s`: number, `l`: number): *[StringBuffer](_esp32_javascript_modules_esp32_javascript_stringbuffer_.stringbuffer.md)‹›*

*Defined in [esp32-javascript/modules/esp32-javascript/stringbuffer.ts:93](https://github.com/marcelkottmann/esp32-javascript/blob/2b53f2e/components/esp32-javascript/modules/esp32-javascript/stringbuffer.ts#L93)*

**Parameters:**

Name | Type |
------ | ------ |
`s` | number |
`l` | number |

**Returns:** *[StringBuffer](_esp32_javascript_modules_esp32_javascript_stringbuffer_.stringbuffer.md)‹›*

___

###  substring

▸ **substring**(`s`: number, `e?`: undefined | number): *[StringBuffer](_esp32_javascript_modules_esp32_javascript_stringbuffer_.stringbuffer.md)‹›*

*Defined in [esp32-javascript/modules/esp32-javascript/stringbuffer.ts:38](https://github.com/marcelkottmann/esp32-javascript/blob/2b53f2e/components/esp32-javascript/modules/esp32-javascript/stringbuffer.ts#L38)*

**Parameters:**

Name | Type |
------ | ------ |
`s` | number |
`e?` | undefined &#124; number |

**Returns:** *[StringBuffer](_esp32_javascript_modules_esp32_javascript_stringbuffer_.stringbuffer.md)‹›*

___

###  toLowerCase

▸ **toLowerCase**(): *string*

*Defined in [esp32-javascript/modules/esp32-javascript/stringbuffer.ts:14](https://github.com/marcelkottmann/esp32-javascript/blob/2b53f2e/components/esp32-javascript/modules/esp32-javascript/stringbuffer.ts#L14)*

**Returns:** *string*

___

###  toString

▸ **toString**(): *string*

*Defined in [esp32-javascript/modules/esp32-javascript/stringbuffer.ts:22](https://github.com/marcelkottmann/esp32-javascript/blob/2b53f2e/components/esp32-javascript/modules/esp32-javascript/stringbuffer.ts#L22)*

**Returns:** *string*

___

###  toUpperCase

▸ **toUpperCase**(): *string*

*Defined in [esp32-javascript/modules/esp32-javascript/stringbuffer.ts:18](https://github.com/marcelkottmann/esp32-javascript/blob/2b53f2e/components/esp32-javascript/modules/esp32-javascript/stringbuffer.ts#L18)*

**Returns:** *string*
