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

\+ **new StringBuffer**(`s?`: undefined | string): *[StringBuffer](_esp32_javascript_modules_esp32_javascript_stringbuffer_.stringbuffer.md)*

*Defined in [esp32-javascript/modules/esp32-javascript/stringbuffer.ts:26](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/stringbuffer.ts#L26)*

**Parameters:**

Name | Type |
------ | ------ |
`s?` | undefined &#124; string |

**Returns:** *[StringBuffer](_esp32_javascript_modules_esp32_javascript_stringbuffer_.stringbuffer.md)*

## Properties

### `Private` content

• **content**: *(string | [StringBuffer](_esp32_javascript_modules_esp32_javascript_stringbuffer_.stringbuffer.md)‹›)[]*

*Defined in [esp32-javascript/modules/esp32-javascript/stringbuffer.ts:25](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/stringbuffer.ts#L25)*

___

###  length

• **length**: *number*

*Defined in [esp32-javascript/modules/esp32-javascript/stringbuffer.ts:26](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/stringbuffer.ts#L26)*

## Methods

###  append

▸ **append**(...`s`: (string | [StringBuffer](_esp32_javascript_modules_esp32_javascript_stringbuffer_.stringbuffer.md)‹›)[]): *[StringBuffer](_esp32_javascript_modules_esp32_javascript_stringbuffer_.stringbuffer.md)*

*Defined in [esp32-javascript/modules/esp32-javascript/stringbuffer.ts:58](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/stringbuffer.ts#L58)*

**Parameters:**

Name | Type |
------ | ------ |
`...s` | (string &#124; [StringBuffer](_esp32_javascript_modules_esp32_javascript_stringbuffer_.stringbuffer.md)‹›)[] |

**Returns:** *[StringBuffer](_esp32_javascript_modules_esp32_javascript_stringbuffer_.stringbuffer.md)*

___

###  indexOf

▸ **indexOf**(`searchString`: string, `position?`: undefined | number): *number*

*Defined in [esp32-javascript/modules/esp32-javascript/stringbuffer.ts:37](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/stringbuffer.ts#L37)*

**Parameters:**

Name | Type |
------ | ------ |
`searchString` | string |
`position?` | undefined &#124; number |

**Returns:** *number*

___

###  substr

▸ **substr**(`s`: number, `l`: number): *[StringBuffer](_esp32_javascript_modules_esp32_javascript_stringbuffer_.stringbuffer.md)*

*Defined in [esp32-javascript/modules/esp32-javascript/stringbuffer.ts:121](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/stringbuffer.ts#L121)*

**Parameters:**

Name | Type |
------ | ------ |
`s` | number |
`l` | number |

**Returns:** *[StringBuffer](_esp32_javascript_modules_esp32_javascript_stringbuffer_.stringbuffer.md)*

___

###  substring

▸ **substring**(`s`: number, `e?`: undefined | number): *[StringBuffer](_esp32_javascript_modules_esp32_javascript_stringbuffer_.stringbuffer.md)*

*Defined in [esp32-javascript/modules/esp32-javascript/stringbuffer.ts:66](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/stringbuffer.ts#L66)*

**Parameters:**

Name | Type |
------ | ------ |
`s` | number |
`e?` | undefined &#124; number |

**Returns:** *[StringBuffer](_esp32_javascript_modules_esp32_javascript_stringbuffer_.stringbuffer.md)*

___

###  toLowerCase

▸ **toLowerCase**(): *string*

*Defined in [esp32-javascript/modules/esp32-javascript/stringbuffer.ts:41](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/stringbuffer.ts#L41)*

**Returns:** *string*

___

###  toString

▸ **toString**(): *string*

*Defined in [esp32-javascript/modules/esp32-javascript/stringbuffer.ts:49](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/stringbuffer.ts#L49)*

**Returns:** *string*

___

###  toUpperCase

▸ **toUpperCase**(): *string*

*Defined in [esp32-javascript/modules/esp32-javascript/stringbuffer.ts:45](https://github.com/marcelkottmann/esp32-javascript/blob/22ffb3d/components/esp32-javascript/modules/esp32-javascript/stringbuffer.ts#L45)*

**Returns:** *string*
