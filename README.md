# egglang: the Egg programming language

[![Build Status](https://travis-ci.org/nventuro/egglang.svg?branch=master)](https://travis-ci.org/nventuro/egglang)

A JavaScript implementation of the Egg programming language, as described by [Marijn Haverbeke](https://marijnhaverbeke.nl/) in [his book](http://eloquentjavascript.net/11_language.html).

## Dependencies
- [Node.js](https://nodejs.org/en/): v8.9.4.
- [npm](https://www.npmjs.com/): v5.6.0.

You can check everything is installed correctly by running the following commands:

```
$ node --version
v8.9.4

$ npm --version
5.6.0
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
Run `egg.sh` to get a REPL, or call it with a `.egg` file to run an Egg program. Sample programs are provided in the [samples directory](https://github.com/nventuro/egglang/tree/dev/samples).

```
$ ./egg.sh samples/modules.egg
40
```

## Language
Egg is an expression-oriented language, with each program being a single expression, and uses prefix notation (also called Polish notation). Because of this, it looks somewhat different from other popular programming languages.

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
Egg is a dynamically typed language, and as such type declarations are not required when creating new variables. This is done using the `:=` operator.

```
> :=(a, 2)
2
> a
2
> +(a, 3)
5
```

Like everything else in Egg, `:=` is an expression, and evaluates to the assigned value.

`=` is used to update the value of a `:=`'d variable, and also evaluates to the assigned value.

```
> :=(a, 2)
2
> :=(a, 3)
ReferenceError: Attempting to re-define local variable
> a
2

> =(a, 3)
3
> a
3
```

### Functions
Functions are created with the `fun` keyword: its first `n-1` arguments are the function's arguments, with the remaining argument being the function body. A function is evaluated to (returns) its body. Functions can be passed as arguments and returned from them, and closures can be created.

```
> :=(f, fun(
    2
  ))
> f()
2

> :=(g, fun(a,
    a
  ))
> g(3)
3

> :=(h, fun(
    :=(i, 2)
  ))
> h()
2
> i
ReferenceError: Undefined variable: i

> :=(adder, fun(a,
    fun(b,
      +(a, b)
    )
  ))
> :=(add_5, adder(5))
> add_5(3)
8
```

### Expression grouping
A program composed of a single expression is quite limiting, but this becomes a non-issue by using the `do` keyword. It evaluates each of its arguments in order, and is evaluated to the value of the last one. This makes it useful for function bodies and flow control, as is shown below.

```
> do(
    :=(a, 3),
    :=(b, 4),
    +(a, b)
  )
7
```

If a particular value wants to be 'returned' from a `do` expression (such as at the end of a function), that value can simply be evaluated last.

```
> :=(f, fun(do(
    :=(a, 2),
    :=(b, 3),
    +(a, b),
    a
  )))
> f()
2
```

### Scope
Both `fun` and `do` create a local scope, in which new variables can be `:=`'d without having them be created in the outer scope. Outer variables can still be accessed and modified using `=`.

### Conditionals
The standard `if` keyword is supported by Egg, but its meaning is slightly different. Since `if` is also an expression, it's actually closer to C's ternary operator (`?:`), and like in C, both the taken and not-taken branches are required. `if` evaluates to the value of the branch that ends up being evaluated.

```
> if(true,
    2,
    3
  )
2

> :=(a, 2)
> if(==(a, 3),
    :=(a, 4),
    :=(a, 5)
  )
5
> a
5
```

### Flow control
The `while` keyword provides the only flow control mechanism, evaluating its body until the condition is false. `do` can be used with `while` to allow more than one expression to be evaluated inside its body.

```
> :=(i, 0)
> while(<(i, 10),
    =(i, +(i, 1))
  )
> i
10

> :=(i, 0)
> :=(pow, 1)
> while(<(i, 10), do(
    =(pow, *(pow, 2)),
    =(i, +(i, 1))
  ))
> pow
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
> :=(arr, array(1, 2, 3))
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
> :=(di, dict(1, 2, 3, "4"))
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
Egg supports modules in a similar way as Node.js's `require` works. The `import` keyword loads an Egg program (an expression), evaluates it, and returns that value. Therefore, modules typically consist of single functions or dictionaries, which are then stored by the user in a variable. Standard Egg modules are provided in the [modules directory](https://github.com/nventuro/egglang/tree/dev/modules).

```
# is_even.egg
fun(x,
  ==(%(x, 2), 0)
)

> :=(is_even, import("is_even.egg"))
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

> :=(parity, import("parity.egg"))
> get(parity, "is_odd")(5)
true
```
