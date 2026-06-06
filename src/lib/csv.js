// CSV parsing for transaction import. Matches the export format produced by
// Transactions.jsx: ID,Title,Date,Amount,Category,Type[,Notes]

// Minimal RFC-4180-ish line parser that handles quoted fields and escaped quotes.
function parseLine(line) {
  const out = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          field += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      out.push(field);
      field = '';
    } else {
      field += ch;
    }
  }
  out.push(field);
  return out;
}

// Parses CSV text into transaction objects. Throws on an unusable file.
// Returns expenses with fresh ids; the caller assigns/merges them.
export function parseTransactionsCSV(text, idSeed = Date.now()) {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length < 2) {
    throw new Error('CSV has no data rows.');
  }

  const header = parseLine(lines[0]).map((h) => h.trim().toLowerCase());
  const idx = (name) => header.indexOf(name);
  const titleI = idx('title');
  const dateI = idx('date');
  const amountI = idx('amount');
  const categoryI = idx('category');
  const typeI = idx('type');
  const notesI = idx('notes');

  if (titleI === -1 || amountI === -1) {
    throw new Error('CSV must include at least Title and Amount columns.');
  }

  const expenses = [];
  let seed = idSeed;
  for (let i = 1; i < lines.length; i += 1) {
    const cols = parseLine(lines[i]);
    const amount = parseFloat(cols[amountI]);
    if (Number.isNaN(amount) || amount <= 0) continue;

    const rawType = (typeI !== -1 ? cols[typeI] : '').trim().toLowerCase();
    const type = rawType === 'income' ? 'income' : 'expense';
    let date = dateI !== -1 ? (cols[dateI] || '').trim() : '';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      const d = new Date(date);
      date = Number.isNaN(d.getTime())
        ? new Date().toISOString().split('T')[0]
        : `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
            d.getDate()
          ).padStart(2, '0')}`;
    }

    expenses.push({
      id: (seed += 1),
      title: (cols[titleI] || 'Imported').trim() || 'Imported',
      amount,
      date,
      category: (categoryI !== -1 ? cols[categoryI] : '').trim() || (type === 'income' ? 'Income' : 'Other'),
      type,
      notes: notesI !== -1 ? (cols[notesI] || '').trim() : '',
    });
  }

  if (expenses.length === 0) {
    throw new Error('No valid transactions found in CSV.');
  }
  return expenses;
}
