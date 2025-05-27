import re
import json
import pandas as pd

with open('d:/nitip-code/jadwal-tayang.json', encoding='utf-8') as f:
    content = f.read()

# Cari semua EwaResultJson
ewa_jsons = re.findall(r'"EwaResultJson":"((?:[^"\\]|\\.)*)"', content)
if not ewa_jsons:
    print("Tidak ditemukan EwaResultJson.")
    exit()

cells = None
for ewa_json in ewa_jsons:
    try:
        # Unescape dengan json.loads dua kali
        ewa_json = json.loads(f'"{ewa_json}"')
        ewa = json.loads(ewa_json)
        grid_json = ewa.get('Result', {}).get('GridBlockModelJson')
        if not grid_json:
            continue
        grid_json = json.loads(grid_json)
        if 'Cells' in grid_json:
            cells = grid_json['Cells']
            break
    except Exception as e:
        continue

if not cells:
    print("Tidak ditemukan Cells.")
    exit()

# Buat dictionary {(row, col): value}
cell_map = {}
for cell in cells:
    row = cell.get('Row')
    col = cell.get('Col')
    value = cell.get('Text') or cell.get('Value') or ''
    if row is not None and col is not None:
        cell_map[(row, col)] = value

# Tentukan ukuran grid
max_row = max([r for r, c in cell_map.keys()])
max_col = max([c for r, c in cell_map.keys()])

# Buat list of list untuk DataFrame
data = []
for r in range(max_row + 1):
    row = []
    for c in range(max_col + 1):
        row.append(cell_map.get((r, c), ''))
    data.append(row)

# Simpan ke Excel
df = pd.DataFrame(data)
df.to_excel('jadwal-tayang.xlsx', index=False, header=False)
print("Berhasil diekspor ke jadwal-tayang.xlsx")