%lex
%options case-insensitive

%x identifier
%x identifier_value
%x description

%%

\s*\%\%.*          { return 'SPACELINE'; }

"SimpleGrammar"		 { return 'SIMPLE_GRAMMAR'; }

[\s]*[\n]+         { return 'SPACELINE'; }
[\s]+	             { return 'SPACELIST'; }

[^\s\[\]\n\:]+               { this.pushState('identifier'); return 'IDENTIFIER'; }

<identifier>[^\:\[\n]*[\n]   { this.popState(); return 'SPACELINE'; }
<identifier>[\s]*[\:][\s]*   { this.popState(); this.pushState('identifier_value'); return 'COLON'; }
<identifier>[\s]*[\[]        { this.popState(); this.pushState('description'); return 'DESC_START'; }

<identifier_value>[^\[\n]+   { return 'IDENTIFIER_VALUE'; }
<identifier_value>[\n]       { this.popState(); return 'SPACELINE'; }
<identifier_value>[\[]       { this.popState(); this.pushState('description'); return 'DESC_START'; }

<description>[^\]]+  { return 'DESCRIPTION'; }
<description>[\]]    { this.popState(); return 'DESC_END'; }

<<EOF>>         { return 'EOF'; }

/lex

%start start

%% /* language grammar */

start
  : simpleGrammar
	| spaceLines simpleGrammar
 	;

simpleGrammar
  : SIMPLE_GRAMMAR document
  | SPACELIST SIMPLE_GRAMMAR document
  | SIMPLE_GRAMMAR spaceLines document
  | SPACELIST SIMPLE_GRAMMAR spaceLines document
  ;

document
	: document statement stop
  | statement stop
	;

spaceLines
  : SPACELINE
  | spaceLines SPACELINE
  ;

statement
  : SPACELIST word     { yy.addWord($1.length, $2.pos, $2.str, $2.description); }
	| SPACELIST fragment { yy.addFragment($1.length, $2.fragment, $2.description); }
	| fragment { yy.addFragment(0, $1.fragment, $1.description); }
  | SPACELIST
	;

fragment
  : IDENTIFIER DESC_START DESCRIPTION DESC_END { $$ = { fragment: $1, description: $3 }; }
  | IDENTIFIER                                 { $$ = { fragment: $1, description: '' }; }
  ;

word
  : IDENTIFIER COLON IDENTIFIER_VALUE DESC_START DESCRIPTION DESC_END { $$ = { pos: $1, str: $3, description: $5 }; }
  | IDENTIFIER COLON IDENTIFIER_VALUE                                 { $$ = { pos: $1, str: $3, description: '' }; }
  ;

stop
  : EOF
  | SPACELINE
  | stop EOF
  | stop SPACELINE
  ;

%%
