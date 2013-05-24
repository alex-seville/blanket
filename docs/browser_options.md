# Blanket Options (browser version)

This guide details all the configuration options available for the browser version of Blanket.js

1.  data-cover-only  
2.  data-cover-never  
3.  data-cover-reporter  
4.  data-cover-adapter  
5.  data-cover-loader  
6.  data-cover-timeout  
7.  data-cover-modulepattern  
8.  data-cover-reporter-options  
9.  data-cover-testReadyCallback  
10.  data-cover-customVariable  
11.  data-cover-flags  
  a.  unordered  
  b. ignoreError  
  c.  autoStart  
  d.  ignoreCors  
  e.  branchTracking  
  f.  sourceURL  
  g.  debug  
  h.  engineOnly  
  i.  commonJS  
  j.  instrumentCache  
  k.  existingRequireJS


1. data-cover-only

This option is used to indicate which files you want included for coverage.  The value can be a string, regular expression, array, or function.
If you're including it in a data attribute, you must use the following format:

regular expression: data-cover-only="//<your regular expression>"
example: data-cover-only="//sourcefile[0-9]{2}.js$/i"
result: the file `sourcefile89.js` would be covered.

array: data-cover-only="[<comma separated list of strings, regular expressions, arryas or functions>]"
example: data-cover-only="['src/','modules/']"
result: files contains `src/` and `modules/` in their files paths will be covered.

function: data-cover-only="#<function declaration or function name>"
example: data-cover-only="#function(str){ return str.length < 5; }"
result: any files whose path is less than 5 characters will be covered.


2. data-cover-never


