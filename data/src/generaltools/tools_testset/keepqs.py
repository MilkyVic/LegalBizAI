import json

# Đọc nội dung của file JSON
with open('/Users/nguyendnt/Documents/GitHub/LegalBizAI_project/data/testset/id_cof/chunk_sz_fl_point/quaset_final.json', 'r', encoding='utf-8') as file:
    data = json.load(file)

# Tạo danh sách chứa các câu hỏi
questions = []

# Duyệt qua từng mục trong dữ liệu và tách riêng câu hỏi
for item in data:
    questions.append({"question": item["question"]})

# Ghi các câu hỏi vào file mới
with open('/Users/nguyendnt/Documents/GitHub/LegalBizAI_project/data/testset/id_cof/chunk_sz_fl_point/questions.json', 'w', encoding='utf-8') as file:
    json.dump(questions, file, ensure_ascii=False, indent=4)

# In ra số lượng câu hỏi
print(f"Đã tách riêng {len(questions)} câu hỏi và lưu vào file 'questions.json'.")
