const path = require('path');
const fs = require('fs');

hexo.extend.console.register('new-note', 'Create a new note', {
  options: [
    { name: '-n, --name', desc: 'Note name', required: true },
    { name: '-bk, --book', desc: 'Notebook name', required: true },
    { name: '-tag, --tag', desc: 'Tags (comma separated)', required: false }
  ]
}, function(args, callback) {
  const name = args.name || args.n;
  const book = args.book || args.bk || args.k;
  const tagStr = args.tag ||args.g ||'';
  if (!name || !book) {
    console.log('Usage: hexo new-note -n "name" -bk "notebook" -tag "tag1,tag2/subtag1"');
    return callback();
  }

  const date = new Date();
  const filename = `${name}.md`;
  const notebookDir = path.join(hexo.source_dir, 'notebooks', book);
  if (!fs.existsSync(notebookDir)) {
    fs.mkdirSync(notebookDir, { recursive: true });
  }
  const filePath = path.join(notebookDir, filename);
  if (fs.existsSync(filePath)) {
    console.log(`File ${filename} already exists in ${notebookDir}.`);
    return callback();
  }
  // 处理标签
  let tags = [];
  if (tagStr) {
    tags = tagStr.split(',').map(t => t.trim()).filter(Boolean);
  }
  // 生成表头
  const frontMatter = [
    '---',
    `title: ${name}`,
    `date: ${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')} ${String(date.getHours()).padStart(2,'0')}:${String(date.getMinutes()).padStart(2,'0')}:${String(date.getSeconds()).padStart(2,'0')}`,
    `tags: [${tags.map(t => '"'+t+'"').join(', ')}]`,
    `notebook: ${book}`,
    '---',
    '',
    ''
  ].join('\n');
  fs.writeFileSync(filePath, frontMatter);
  console.log(`Created: ${filePath}`);
  callback();
}); 
