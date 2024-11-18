# Graceful Language - Core

**NOTE:** In very early development stage. Primairly experimenting with a few ideas so use at your own peril.

A simple programing language created for the common person. This package contains the core minimal features of the language with the hope of building on top of that. Graceful has primarily been inspired by [Lisp](https://en.wikipedia.org/wiki/Lisp_(programming_language)), [Erlang](https://en.wikipedia.org/wiki/Erlang_(programming_language)), [Forth](https://en.wikipedia.org/wiki/Forth_(programming_language)) and [Javascript](https://en.wikipedia.org/wiki/JavaScript). However, it should be noted that languages like [Blitz Basic](https://en.wikipedia.org/wiki/Blitz_BASIC), [Python](https://en.wikipedia.org/wiki/Python_(programming_language)), [Actionscript](https://en.wikipedia.org/wiki/ActionScript), [Smalltalk](https://en.wikipedia.org/wiki/Smalltalk), [Eiffel](https://en.wikipedia.org/wiki/Eiffel_(programming_language)), [Lua](https://en.wikipedia.org/wiki/Lua_(programming_language)), [Ruby](https://en.wikipedia.org/wiki/Ruby_(programming_language)) and many more have also played somewhat of a role in Graceful's design. The hope with Graceful is to be a simple language at it's core with a simple set of ideas to work with. From there the end user can build upon the language and tailor it to their own needs. Graceful has been primarily developed in the Javascript and Browser eco system so that it can easily be portable and shared with others. Hopefully as the langauge gets more stable it can be port to other environments as well.

## Keywords

In the interest of keeping Graceful simple the desire is to reduce the total number of keywords in the core language. Currently here are the list of 8 keywords reserved by the language.

- `_list` - Creates a list of tag (symbolic) items. A list can be thought of like a JS literal object or associative array.
- `_item` - A base structure within graceful that holds metadata about the value or target referenced. It is the main generic type used by the language. Items contian data, info, temp, link metadata structures about the item.
- `_get` - Get a reference from a specified storage target.
- `_ignore` - Ignore the contained content. Useful for comments in code
- `_log` - Output content to some display. The intention is that the host system implements this functionality.
- `_set` - Set a reference for a specified storage target.
- `_share` - Share a reference to a specific target. Think of this like a return statement in a function.
- `_write` - Capture the the contained contents as a string / list of character values or codes.

It is important to note that the language marks reserved keywords with a leading `_` character. This is so that keywords can be re-mapped or aliased to some other keyword suited for the needs of the end user.

## Concepts and Terminology

**NOTE:** To come in the future...

## Examples

**NOTE:** To come in the future...

## Resources

- ["Stop Writing Dead Programs" by Jack Rusher (Strange Loop 2022)](https://www.youtube.com/watch?v=8Ab3ArE8W3s)
- [OSCON 2010: Rob Pike, "Public Static Void"](https://www.youtube.com/watch?v=5kj5ApnhPAE)
- [Breaking Open: Erlang](https://www.youtube.com/watch?v=m5RWdNBPsTY)
- [LISP in 100 Seconds](https://www.youtube.com/watch?v=INUHCQST7CU)
- [Why LISP is The Language of Legends](https://www.youtube.com/watch?v=V02SQDh47gA)
- [Stop Writing Javascript Compilers, Make Marcros Instead](https://archive.jlongster.com/Stop-Writing-JavaScript-Compilers--Make-Macros-Instead)
- [mal - Make a Lisp](https://github.com/kanaka/mal)
- [Symbolics Lisp Machine demo Jan 2013](https://www.youtube.com/watch?v=o4-YnLpLgtk)
- [Yesterday's Computer of Tomorrow: The Xerox Alto - Smalltalk-76 Demo](https://www.youtube.com/watch?v=NqKyHEJe9_w)
- [What have we lost?](https://www.youtube.com/watch?v=7RNbIEJvjUA)
- ["We Really Don't Know How to Compute!" - Gerald Sussman (2011)](https://www.youtube.com/watch?v=HB5TrK7A4pI)
- [The Unreasonable Effectiveness of Dynamic Typing for Practical Programs](https://vimeo.com/74354480)
- [The broken promise of static typing](https://danlebrero.com/2016/06/19/broken-promise-of-static-typing/)
- [You Might Not Need TypeScript (or Static Types)](https://medium.com/javascript-scene/you-might-not-need-typescript-or-static-types-aa7cb670a77b)
- [The TypeScript Tax](https://medium.com/javascript-scene/the-typescript-tax-132ff4cb175b)
- [Programming Language Keywords Count](https://github.com/e3b0c442/keywords)
- [Why Isn't Functional Programming the Norm?](https://www.youtube.com/watch?v=QyJZzq0v7Z4)
- [Mordern C and What We Can Learn From It - Luca Sas - ACCU 2021](https://www.youtube.com/watch?v=QpAhX-gsHMs)
- [Why Forth? Programming Language](https://www.youtube.com/watch?v=7PHPQcO0O2Y)
- [Easy Forth](https://skilldrick.github.io/easyforth/)
