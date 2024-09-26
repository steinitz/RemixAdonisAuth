export const wildcardCompare = (aString: string, wildcardPattern: string) =>{
	// first, convert wildcard pattern to a regex pattern
	const regexPattern = new RegExp("^" +
		wildcardPattern
			.replace(/\?/g, ".")
			.replace(/\*/g, ".*") +
		"$"
	);
  // then check for a match
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
