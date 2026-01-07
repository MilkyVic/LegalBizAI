import pandas as pd
import json

qaset_file = 'data/testset/qas_dataset/mix /qaset_article.json'

with open(qaset_file, 'r', encoding='utf-8') as f:
    df = pd.json_normalize(json.load(f))

# Xóa cột 'chunk_range'
df = df.drop(columns=['chunk_range'])

# Lưu DataFrame đã cập nhật trở lại tệp JSON
with open(qaset_file, 'w', encoding='utf-8') as f:
    json.dump(df.to_dict('records'), f, ensure_ascii=False, indent=4)

print("Đã xóa cột 'chunk_range' và lưu tệp JSON đã cập nhật.")
