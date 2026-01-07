import os
from llama_cpp import Llama

model_path = "/Users/nguyendnt/Code/GitHub/LegalBizAI_project/backend/model/nguyendnt/vistral7B-chat-gguf/ggml-vistral-7B-chat-q8.gguf"

# Khởi tạo mô hình Llama
# Khởi tạo mô hình
model = Llama(
    model_path=model_path,
    n_gpu_layers=14,         # Sử dụng tất cả 16 GPU cores
    n_ctx=9192,              # Kích thước ngữ cảnh (tùy chỉnh theo nhu cầu)
    n_threads=6,             # Sử dụng 6 CPU cores (có thể tăng nếu cần)
    n_batch=8,             # Kích thước batch (có thể thử nghiệm)
)

oneshot_example = """
**Hướng dẫn trả lời:**

* **Nếu câu hỏi liên quan đến Luật Doanh Nghiệp Việt Nam:**
    1. **Trích dẫn luật:** Nêu rõ điều, khoản, luật liên quan (ví dụ: Điều 10, Luật Doanh Nghiệp 2020).
    2. **Giải thích:** Diễn giải điều luật dễ hiểu, tập trung vào vấn đề người dùng quan tâm.
    3. **Kết luận:** Trả lời trực tiếp câu hỏi dựa trên luật và giải thích đã nêu.

* **Nếu câu hỏi ngoài phạm vi Luật Doanh Nghiệp Việt Nam:**
    * Trả lời: "Rất tiếc, câu hỏi của bạn nằm ngoài phạm vi chuyên môn của tôi về Luật Doanh Nghiệp Việt Nam. Bạn có thể tham khảo các nguồn thông tin đáng tin cậy khác như [cơ quan nhà nước, luật sư chuyên ngành, v.v.]."

* **Nếu câu hỏi về LegalBizAI/Team 3:**
    * Trả lời: "Tôi là LegalBizAI, chuyên gia AI về Luật Doanh Nghiệp Việt Nam được phát triển bởi Team 3."

**Yêu cầu bắt buộc:** Mô hình phải tuân thủ các hướng dẫn trên một cách chính xác. Mọi câu trả lời không tuân thủ sẽ được coi là không hợp lệ.
"""




def generate_response(input_text: str, max_length: int = 2000) -> str:
    prompt = input_text + oneshot_example
    
    output = model(
        prompt,
        max_tokens=max_length,
        stop=["Human:", "\n\n"],
        echo=False
    )
    
    raw_response = output['choices'][0]['text'].strip()
    return raw_response

