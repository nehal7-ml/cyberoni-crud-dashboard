/**
 * drawdown.js
 * (c) Adam Leggett
 */
import { Editor, TinyMCE } from "tinymce";

function markdown(src: string) {

    var rx_lt = /</g;
    var rx_gt = />/g;
    var rx_space = /\t|\r|\uf8ff/g;
    var rx_escape = /\\([\\\|`*_{}\[\]()#+\-~])/g;
    var rx_hr = /^([*\-=_] *){3,}$/gm;
    var rx_blockquote = /\n *&gt; *([^]*?)(?=(\n|$){2})/g;
    var rx_list = /\n( *)(?:[*\-+]|((\d+)|([a-z])|[A-Z])[.)]) +([^]*?)(?=(\n|$){2})/g;
    var rx_listjoin = /<\/(ol|ul)>\n\n<\1>/g;
    var rx_highlight = /(^|[^A-Za-z\d\\])(([*_])|(~)|(\^)|(--)|(\+\+)|`)(\2?)([^<]*?)\2\8(?!\2)(?=\W|_|$)/g;
    var rx_code = /\n((```|~~~).*\n?([^]*?)\n?\2|((    .*?\n)+))/g;
    var rx_link = /((!?)\[(.*?)\]\((.*?)( ".*")?\)|\\([\\`*_{}\[\]()#+\-.!~]))/g;
    var rx_table = /\n(( *\|.*?\| *\n)+)/g;
    var rx_thead = /^.*\n( *\|( *\:?-+\:?-+\:? *\|)* *\n|)/;
    var rx_row = /.*\n/g;
    var rx_cell = /\||(.*?[^\\])\|/g;
    var rx_heading = /(?=^|>|\n)([>\s]*?)(#{1,6}) (.*?)( #*)? *(?=\n|$)/g;
    var rx_para = /(?=^|>|\n)\s*\n+([^<]+?)\n+\s*(?=\n|<|$)/g;
    var rx_stash = /-\d+\uf8ff/g;

    function replace(rex: RegExp | string, replace: ((sub: string, ...arg: any[]) => string) | string) {
        if (typeof replace === 'string') {
            src = src.replace(rex, replace);

        } else {
            src = src.replace(rex, replace);

        }
    }

    function element(tag: string, content: string) {
        return '<' + tag + '>' + content + '</' + tag + '>';
    }

    function blockquote(src: string): string {
        return src.replace(rx_blockquote, function (all, content) {
            return element('blockquote', blockquote(highlight(content.replace(/^ *&gt; */gm, ''))));
        });
    }

    function list(src: string): string {
        return src.replace(rx_list, function (all, ind, ol, num, low, content) {
            var entry = element('li', highlight(content.split(
                RegExp('\n ?' + ind + '(?:(?:\\d+|[a-zA-Z])[.)]|[*\\-+]) +', 'g')).map(list).join('</li><li>')));

            return '\n' + (ol
                ? '<ol start="' + (num
                    ? ol + '">'
                    : parseInt(ol, 36) - 9 + '" style="list-style-type:' + (low ? 'low' : 'upp') + 'er-alpha">') + entry + '</ol>'
                : element('ul', entry));
        });
    }

    function highlight(src: string): string {
        return src.replace(rx_highlight, function (all, _, p1, emp, sub, sup, small, big, p2, content) {
            return _ + element(
                emp ? (p2 ? 'strong' : 'em')
                    : sub ? (p2 ? 's' : 'sub')
                        : sup ? 'sup'
                            : small ? 'small'
                                : big ? 'big'
                                    : 'code',
                highlight(content));
        });
    }

    function unesc(str: string) {
        return str.replace(rx_escape, '$1');
    }

    var stash: any[] = [];
    var si = 0;

    src = '\n' + src + '\n';

    replace(rx_lt, '&lt;');
    replace(rx_gt, '&gt;');
    replace(rx_space, '  ');

    // blockquote
    src = blockquote(src);

    // horizontal rule
    replace(rx_hr, '<hr/>');

    // list
    src = list(src);
    replace(rx_listjoin, '');

    // code
    replace(rx_code, function (all, p1, p2, p3, p4): string {
        stash[--si] = element('pre', element('code', p3 || p4.replace(/^    /gm, '')));
        return si + '\uf8ff';
    });

    // link or image
    replace(rx_link, function (all, p1, p2, p3, p4, p5, p6) {
        stash[--si] = p4
            ? p2
                ? '<img src="' + p4 + '" alt="' + p3 + '"/>'
                : '<a href="' + p4 + '">' + unesc(highlight(p3)) + '</a>'
            : p6;
        return si + '\uf8ff';
    });

    // table
    replace(rx_table, function (all, table) {
        var sep = table.match(rx_thead)[1];
        return '\n' + element('table',
            table.replace(rx_row, function (row: string, ri: any) {
                return row == sep ? '' : element('tr', row.replace(rx_cell, function (all: any, cell: any, ci: any) {
                    return ci ? element(sep && !ri ? 'th' : 'td', unesc(highlight(cell || ''))) : ''
                }))
            })
        )
    });

    // heading
    replace(rx_heading, function (all, _, p1, p2) { return _ + element('h' + p1.length, unesc(highlight(p2))) });

    // paragraph
    replace(rx_para, function (all, content) { return element('p', unesc(highlight(content))) });

    // stash
    replace(rx_stash, function (all: string) { return stash[parseInt(all)] });

    return src.trim();
};


export function markdownPlugin(editor: Editor) {
    // Add a button that opens a window
    editor.ui.registry.addButton('markdown', {
        text: 'M↓',
        tooltip: 'Markdown',
        icon: '#',
        onAction: function () {
            console.log(editor.getContent());
            const newModal = document.createElement('dialog');
            newModal.classList.add("w-screen", "h-screen", "fixed", "top-0", "left-0", "p-3", "z-50", "bg-black", "backdrop-blur-lg", "bg-opacity-50");
            newModal.insertAdjacentHTML('afterbegin', `
                <div  class="w-full h-full z-50 flex justify-center items-center p-10">

                    <div class=" bg-white shadow-md rounded p-8 container w-full overflow-auto max-h-screen z-50 flex flex-col justify-center">
                        <h1 class="font-bold text-4xl">Markdown</h1>
                       <textarea id="markdown" rows="10" class="w-full h-fit max-h-[60vh]"> </textarea>
                        <button id="parse-markdown" class="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300">Parse</button>
                    </div>               
                
                </div> 
            
            `);

            document.body.appendChild(newModal);
            newModal.show()
            document.getElementById('parse-markdown')?.addEventListener('click', () => {

                const markdownRaw = (document.getElementById('markdown') as HTMLTextAreaElement).value;
                editor.setContent("<pre>" + markdown(markdownRaw) + "</pre>", { format: 'raw' });
                newModal.close()
            })
            // 

        }
    });


}
