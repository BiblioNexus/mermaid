%lex
%options case-insensitive

%x line

%%

\s*\%\%.*          { return 'SPACELINE'; }

"SimpleGrammar"		 { return 'SIMPLE_GRAMMAR'; }

[\s]*[\n]+         { return 'SPACELINE'; }
[\s]+	             { return 'SPACELIST'; }

[^\s\n]+[^\n]*     { this.pushState('line'); return 'LINE'}

<line>[\n]         { this.popState(); return 'SPACELINE'}

<<EOF>>            { return 'EOF'; }

/lex

%start start

%% /* language grammar */

start
  : simpleGrammar
	| spaceLines simpleGrammar
 	;

simpleGrammar
  : SIMPLE_GRAMMAR
  | SPACELIST SIMPLE_GRAMMAR document
  | SIMPLE_GRAMMAR spaceLines document
  | SPACELIST SIMPLE_GRAMMAR spaceLines document
  ;

document
	: document statement stop
  | statement stop
  | document statement
  | statement
	;

spaceLines
  : SPACELINE
  | spaceLines SPACELINE
  ;

statement
  : SPACELIST LINE     { yy.addNewLine($1.length, $2); }
  | LINE               { yy.addNewLine(0, $1); }
  | SPACELIST
	;

stop
  : EOF
  | SPACELINE
  | stop EOF
  | stop SPACELINE
  ;

%%
