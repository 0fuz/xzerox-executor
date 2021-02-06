# xzerox-executor

Is a toolkit to simplify writing *parsers*, *scrapers*, *bots* and use HTTPs layer in order with parallel job execution in mind. 

Own written subprojects can be used from command-line (it makes possible to write any kind of GUI you wish)

You need to write only single job processing.

You don't need to think "how to parallelize jobs" or "how to write thread-safe execution" they are solved.

**Important** Please do not use in any unauthorized or illegal purpose. This is the wish of the author and non-binding.

# Features
- Http/Https proxy support
- Thread-safe parallelized job execution.
- Loading jobs from file
- Saving job result to files
- Do not execute already processed jobs by file-based *cache* system.
- Handful functions to look more than browser, android, ios device.
- Covering by tests in mind. It solves many design problems and makes code more stable.
 
# Why nodejs/typescript
pluses:
1. Its more web-friendly language. For example JSON workflow is ugly in some strong-typed languages.
2. It contains friendly sync/async workflow.
3. Any usage are thread safe.

minuses:
1. 1 cmd process = 1 cpu core (or virtual core)
2. nodejs will lose competition with compilable languages in speed comparison (for example nodejs md5 x5 times slower than similar code for golang) but its enough for scrappers/parsers.
3. If you are far from async/await/promises it might look strange first times.


# Hot to run tests?
```
npm i -D
npm run cover
```

# Supported platforms
Windows/Linux/MacOs.

*if you have been faced with installation problems create the issue, and I will try to help.*


# Contributing
Contributing possible by several ways:
- make the issue under github
- by pull request
- by discussions page

# License
MIT License.  