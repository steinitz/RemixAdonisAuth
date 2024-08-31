// Naive plain text message to html message
// currently only used for support requests
export const convertTextMessageToHtml = (textMessage: string)  => {
	let htmlMessage=""; // set a default return value
	let trimmed=textMessage.trim(); // remove leading and traling whitespace
	let counter;
	let needClosingPTag = false

	if(trimmed.length > 0){
		htmlMessage+="<p>"; // begin by creating paragraph
		for(counter=0; counter < trimmed.length; counter++){
			switch (trimmed[counter]){
				// new paragraph <p> on \n\n, simple break <br> on \n
				case '\n':
					if (trimmed[counter+1]==='\n'){
						htmlMessage+="</p>\n<p>";
						needClosingPTag = true;
						counter++;
					}
					else {
						if (needClosingPTag){
							htmlMessage+="</p>";
							needClosingPTag = false;
						}
						htmlMessage+="<br>";
					}
					break;

				// an incomplete list of escapes/substitutions
				case ' ':
					if(trimmed[counter-1] !== ' ' && trimmed[counter-1] !== '\t')
						htmlMessage+=" ";
					break;

				case '\t':
					if(trimmed[counter-1] !== '\t')
						htmlMessage+=" ";
					break;

				case '&':
					htmlMessage+="&amp;";
					break;

				case '"':
					htmlMessage+="&quot;";
					break;

				case '>':
					htmlMessage+="&gt;";
					break;

				case '<':
					htmlMessage+="&lt;";
					break;

				default:
					htmlMessage+=trimmed[counter];
			}
		}
		if (needClosingPTag) htmlMessage+="</p>" // finish by closing paragraph, if needed
	}
	return htmlMessage;
}
