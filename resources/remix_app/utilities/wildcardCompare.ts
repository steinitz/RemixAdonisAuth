export const wildcardCompare = (aString: string, wildcardPattern: string) =>{
	// Convert wildcard pattern to a regular expression pattern
	const regexPattern = new RegExp("^" +
		wildcardPattern
			.replace(/\?/g, ".")
			.replace(/\*/g, ".*") +
		"$"
	);
  // do the compare
	return regexPattern.test(aString);
}

// Test case
// const text = "this is super useful";
// const pattern = "*his is su*r us*ful";
//
// if (wildcardMatchRegExp(text, pattern)) {
// 	console.log("Pattern is Matched");
// } else {
// 	console.log("Pattern is not matched");
// }
