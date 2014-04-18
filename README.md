# Queuer

> Intuitive flow control library for asynchronous code

# How to use

## Parallel execution

### Visual
```
S
V
V
V
V
V
E
```
### Code

```js
_.concurrent({
  first: function (cb) {
    setTimeout(function () {
      cb(null, 'boom');
    }, 1000);
  },
  second: function (cb) {
    cb(null, 'foo');
  }
}, function (err, results) {
  console.log(results);
  // <- { first: 'boom', second: 'foo' }
});
```

# How to extend

TBD

# How to build

TBD

# API docs

TBD

# Similar projects

* [async](https://github.com/caolan/async)
* * [async](https://github.com/caolan/async)
