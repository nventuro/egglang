# egglang: the Egg programming language

[![Build Status](https://travis-ci.org/nventuro/egglang.svg?branch=master)](https://travis-ci.org/nventuro/egglang)

A JavaScript implementation of the Egg programming language, as described by [Marijn Haverbeke](https://marijnhaverbeke.nl/) in [his book](http://eloquentjavascript.net/11_language.html).

## Dependencies
- [Node.js](https://nodejs.org/en/): v8.9.4.
- [npm](https://www.npmjs.com/): v5.6.0.

You can check everything is installed correctly by running the following commands:

```
$ node --version
v8.9.1

$ npm --version
5.5.1
```

## Build and Test

First, make sure that you have all the dependencies listed in the previous section. Then, clone the project repository and enter the root directory:

```
$ git clone https://github.com/nventuro/egglang.git
$ cd egglang
```

Next, build the project dependencies:

`$ npm install`

To make sure everything is set up correctly, it would be a good idea to run all tests at this point and verify that they finish successfully: 

`$ npm test`

## Usage
Run `egg.sh` to get a REPL, or call it with a `.egg` file to run an Egg program. Sample programs are provided in the [samples directory](https://github.com/nventuro/egglang/tree/master/samples).

```
$ ./egg.sh samples/modules.egg
40
```

## Language
Egg is an expression-oriented language, with each program being a single expression, and uses prefix notation (also called Polish notation). Because of this, it looks somewhat different from regular programming languages.

### Types
Egg supports integers (both positive and negative), boolean values, and literal strings (escape characters are not allowed though).

### Basic operations
All of the basic arithmetic and comparison operands are supported, and can be used by calling a function with their name. These operations can be chained.

```
> +(1, 2)
3
> /(12, -3)
-4
> +(*(4, 2), -(5, 3))
10
> <(5, 10)
true
```

### Assignment
Egg is a dynamically typed language, and as such type declarations are not required when creating new variables. This is done using the `define` keyword.

```
> define(a, 2)
2
> a
2
> +(a, 3)
5
```

Like everything else in Egg, `define` is also an expression, and evaluates to the assigned value. `set` can also be used to update the value of a `define`d variable. This can be used to make assignments to variables in an outer scope (such as global variables), instead of creating new variables in the local scope (which is `define`'s behavior).

### Functions
Functions are created with the `fun` keyword: its first `n-1` arguments are the function's arguments, with the remaining argument being the function body. A function is evaluated to (returns) its last expression. Functions can be passed as arguemnts and returned from them, and closures can be created.

```
> define(f, fun(
    2
  ))
> f()
2

> define(g, fun(a,
    a
  ))
> g(3)
3

> define(h, fun(
    define(i, 2)
  ))
> h()
2
> i
ReferenceError: Undefined variable: i

> define(adder, fun(a,
    fun(b,
      +(a, b)
    )
  ))
> define(add_5, adder(5))
> add_5(3)
8
```

### Expression grouping
A program composed of a single expression is quite limiting, but this becomes a non-issue when using the `do` keyword. It evaluates each of its arguments in order, and is evaluated to the value of the last one. This makes it useful for function bodies and flow control, as will later be demonstrated.

```
> do(
    define(a, 3),
    define(b, 4),
    +(a, b)
  )
7
```

If a particular value wants to be 'returned' from a `do` expression (such as at the end of a function), an useful trick is to `set` it to itself.

### Conditionals
The standard `if` keyword is supported by Egg, but its meaning is slightly different. Since `if` is also an expression, it's actually closer to C's ternary operator (`?:`), and like in C, both the taken and not-taken branches are required. `if` evaluates to the value of the branch that ends up being evaluated.

```
> if(true,
    2,
    3
  )
2

> define(a, 2)
> if(==(a, 3), 
    define(a, 4),
    define(a, 5)
  )
5
> a 
5
```
 
### Flow control
The `while` keyword provides the only flow control mechanism, evaluating its body until its condition is false. `do` can be used with `while` to allow more than one expression to be evaluated inside its body.
 
```
> define(i, 0)
> while(<(i, 10),
    set(i, +(i, 1))
  )
> i
10

> define(i, 0)
> define(accum, 1)
> while(<(i, 10), do(
    set(accum, *(accum, 2)),
    set(i, +(i, 1))
  ))
> accum
1024
```

`while` is also an expression, and always evaluates to false.

### Printing
Egg programs can print to the console by calling `print`, which evaluates to its argument.

### Collections
There are two kinds of collections in Egg: arrays and dictionaries. Their interface is similar, but usage differs slightly. Both collections can store any kind of object.

#### Arrays
Arrays are created by calling `array` with the values to be stored in the array (or none for an empty array). These values can then be retrieved by calling `get` with a zero-based index, and new values can be added at the end of the array by calling `push`. The length of the array is returned by `length`.

```
> define(arr, array(1, 2, 3))
[1, 2, 3]
> arr.get(0)
1
> arr.push("4")
[1, 2, 3, "4"]
> arr
[1, 2, 3, "4"]
> length(arr)
4
```

#### Dictionaries
Dictionaries are created by calling `dict` with an even number of arguments (none for an empty dictionary): even arguments will be keys, and odd arguments will be values. These values can then be retrieved by calling `get` with an appropiate key, and new key-value pairs can be added by calling `push`. The number of key-value pairs is returned by `length`.

```
> define(di, dict(1, 2, 3, "4"))
{1: 2, 3: "4"}
> arr.get(1)
2
> di.push("abc", 123)
{1: 2, 3: "4", "abc": 123}
> di
{1: 2, 3: "4", "abc": 123}
> length(di)
3
```

### Modules
Egg supports modules in a similar way as Node.js's `require` works. The `import` keyword loads en Egg program (an expression), evaluates it, and returns that value. Therefore, modules typically consist of single functions or dictionaries, which are then stored by the user in a variable. Standard Egg modules are provided in the [modules directory](https://github.com/nventuro/egglang/tree/master/modules).

```
# is_even.egg
fun(x,
  ==(%(x, 2), 0)
)

> define(is_even, import("is_even.egg"))
> is_even(2)
true

# parity.egg
dict(
  "is_even", fun(x,
    ==(%(x, 2), 0)
  ),
  "is_idd", fun(x,
    !=(%(x, 2), 0)
  )
)

> define(parity, import("parity.egg"))
> get(parity, "is_odd")(5)
true
```
