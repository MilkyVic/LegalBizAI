import json
import re
# Đọc file JSON
with open('/Users/nguyendnt/Documents/GitHub/LegalBizAI_project/data/testset/qas_dataset/mix /all_chunks_by_clauseWarticle.json', 'r', encoding='utf-8') as file:
    data = json.load(file)

def word_count(text):
    words = re.findall(r'\b\w+\b', text)
    return len(words)

max_word_count = 0
max_id = None

for item in data:
    count = word_count(item['passage'])
    if count > max_word_count:
        max_word_count = count
        max_id = item['id']

print(f'ID có số từ nhiều nhất là: {max_id}, với {max_word_count} từ.')