/** mermaid
 *  https://knsv.github.io/mermaid
 *  (c) 2015 Knut Sveidqvist
 *  MIT license.
 */
%lex
%options case-insensitive

%x string
%x title
%x acc_title
%x acc_descr
%x acc_descr_multiline
%%
\%\%(?!\{)[^\n]*                                                /* skip comments */
[^\}]\%\%[^\n]*                                                 /* skip comments */{ /*console.log('');*/ }
[\n\r]+                                                         return 'NEWLINE';
\%\%[^\n]*                                                      /* do nothing */
[\s]+ 		                                                      /* ignore */
title                                                           { this.begin("title");return 'title'; }
<title>(?!\n|;|#)*[^\n]*                                        { this.popState(); return "title_value"; }

accTitle\s*":"\s*                                               { this.begin("acc_title");return 'acc_title'; }
<acc_title>(?!\n|;|#)*[^\n]*                                    { this.popState(); return "acc_title_value"; }
accDescr\s*":"\s*                                               { this.begin("acc_descr");return 'acc_descr'; }
<acc_descr>(?!\n|;|#)*[^\n]*                                    { this.popState(); return "acc_descr_value"; }
accDescr\s*"{"\s*                                { this.begin("acc_descr_multiline");}
<acc_descr_multiline>[\}]                       { this.popState(); }
<acc_descr_multiline>[^\}]*                     return "acc_descr_multiline_value";
["]                                                             { this.begin("string"); }
<string>["]                                                     { this.popState(); }
<string>[^"]*                                                   { return "txt"; }
"SimpleGrammar"		                                              return 'SIMPLE_GRAMMAR';
"showData"                                                      return 'showData';
":"[\s]*[\d]+(?:\.[\d]+)?                                       return "value";
<<EOF>>                                                         return 'EOF';

/lex

%start start

%% /* language grammar */

start
  : eol start
	| SIMPLE_GRAMMAR document
  | SIMPLE_GRAMMAR showData document {yy.setShowData(true);}
	;

document
	: /* empty */
	| document line
	;

line
	: statement eol { $$ = $1 }
	;

statement
  :
	| txt value          { yy.addSection($1,yy.cleanupValue($2)); }
	| title title_value  { $$=$2.trim();yy.setDiagramTitle($$); }
  | acc_title acc_title_value  { $$=$2.trim();yy.setAccTitle($$); }
  | acc_descr acc_descr_value  { $$=$2.trim();yy.setAccDescription($$); }
  | acc_descr_multiline_value { $$=$1.trim();yy.setAccDescription($$); }  | section {yy.addSection($1.substr(8));$$=$1.substr(8);}
	;

eol
  : NEWLINE
  | ';'
  | EOF
  ;

%%
