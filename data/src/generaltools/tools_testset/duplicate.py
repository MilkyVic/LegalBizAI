import json

# Đọc dữ liệu từ file JSON
with open('/Users/nguyendnt/Documents/GitHub/LegalBizAI_project/data/documents/raw_testset/QA.thuvienphapluat.json', 'r', encoding='utf-8') as file:
    data = json.load(file)

# Sử dụng set để lưu trữ các câu hỏi đã gặp
unique_questions = set()
filtered_data = []

# Lọc các câu hỏi giống nhau, chỉ giữ lại một
for item in data:
    question = item['question']
    if question not in unique_questions:
        unique_questions.add(question)
        filtered_data.append(item)

# Đếm số câu hỏi còn lại
remaining_questions_count = len(filtered_data)

# Ghi dữ liệu đã lọc vào file JSON mới
with open('data/testset/backup/qaset_rd.json', 'w', encoding='utf-8') as file:
    json.dump(filtered_data, file, ensure_ascii=False, indent=4)

print(f"Đã lọc và lưu các câu hỏi duy nhất vào file 'filtered_file.json'. Số câu hỏi còn lại: {remaining_questions_count}")
