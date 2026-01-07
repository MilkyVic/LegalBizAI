import os
from sentence_transformers import SentenceTransformer

# Đường dẫn tới thư mục chứa mô hình
model_path = "./model/embedding"

# Kiểm tra nếu mô hình đã tồn tại trong thư mục cục bộ
if not os.path.exists(model_path):
    print("Mô hình chưa tồn tại trong thư mục cục bộ. Đang tải về...")
    model = SentenceTransformer('BAAI/bge-m3')
    model.save(model_path)
else:
    print("Mô hình đã tồn tại trong thư mục cục bộ. Đang tải mô hình từ thư mục...")
    model = SentenceTransformer(model_path)

# Kiểm tra mô hình
print(model)

# Các hàm và biến khác
import json
import re
import unicodedata as ud
import faiss
import numpy as np
import warnings

# Suppress specific warnings
warnings.filterwarnings("ignore", category=DeprecationWarning, module="langchain._api.module_import")
warnings.filterwarnings("ignore", category=UserWarning, module="transformers.utils.generic")

bizlaw_short_dict = {
    "BCC": "hợp tác kinh doanh",
    "BHTN": "Bảo hiểm thất nghiệp",
    "BHXH": "Bảo hiểm xã hội",
    "BHYT": "Bảo hiểm y tế",
    "CT": "Công ty",
    "CTCP": "Công ty cổ phần",
    "DNTN": "Doanh nghiệp tư nhân",
    "DV": "Dịch vụ",
    "EUR": "Euro",
    "EVN": "Điện lực Việt Nam",
    "GCN": "Giấy chứng nhận",
    "GPS": "hệ thống định vị toàn cầu GPS",
    "HĐQT": "Hội đồng quản trị",
    "JPY": "Yên Nhật",
    "MTV": "Một thành viên",
    "STT": "Số thứ tự",
    "TM": "Thương mại",
    "TNDN": "thu nhập doanh nghiệp",
    "TNHH": "Trách nhiệm hữu hạn",
    "TP": "Thành phố",
    "USD": "Đô la Mỹ",
    "ĐHĐCĐ": "Đại hội đồng cổ đông",
    "ĐKKD": "Đăng ký kinh doanh",
}
stop_words_vn = set(
    [
        "và",
        "của",
        "là",
        "các",
        "trong",
        "với",
        "cho",
        "để",
        "những",
        "khi",
        "thì",
        "này",
        "làm",
        "từ",
        "đã",
        "sẽ",
        "rằng",
        "mà",
        "như",
        "lại",
        "ra",
        "sau",
        "cũng",
        "vậy",
        "nếu",
        "đến",
        "thế",
        "biết",
        "theo",
        "đâu",
        "đó",
        "trước",
        "vừa",
        "rồi",
        "trên",
        "dưới",
        "ngoài",
        "gì",
        "còn",
        "nữa",
        "nào",
        "hết",
        "ai",
        "ấy",
        "lúc",
        "ở",
        "đi",
        "về",
        "ngay",
        "luôn",
        "đang",
        "thì",
        "đây",
        "kia",
        "ấy",
        "điều",
        "việc",
        "vì",
        "giữa",
        "qua",
        "vẫn",
        "chỉ",
        "nói",
        "thật",
        "hơn",
        "vậy",
        "hay",
        "lại",
        "ngày",
        "giờ",
        "tại",
        "bởi",
        "sao",
        "trước",
        "sau",
        "đó",
        "mà",
        "về",
        "đến",
        "thì",
        "được",
        "thế",
        "còn",
        "đến",
        "cũng",
        "này",
        "đấy",
        "một",
        "vì",
        "những",
        "thì",
        "vậy",
        "thế",
        "đây",
        "vẫn",
        "lại",
        "thì",
        "còn",
        "đó",
        "này",
        "ở",
        "trong",
        "làm",
        "khi",
        "vậy",
        "này",
        "đó",
        "ở",
        "được",
        "làm",
        "để",
        "khi",
        "với",
        "về",
        "đi",
        "cho",
        "về",
        "đã",
        "với",
        "như",
        "đi",
        "này",
        "như",
        "được",
        "cho",
        "thì",
        "làm",
        "ở",
        "như",
        "điều",
        "khi",
        "với",
        "trong",
    ]
)

index_path = "./data/faiss_index"

faiss_index = faiss.read_index(index_path)


def tokenizer(text):
    text = re.sub(r"[^\w\s%]", "", ud.normalize("NFC", text))
    words = text.split()
    for idx in range(len(words)):
        if words[idx] in bizlaw_short_dict.keys():
            words[idx] = bizlaw_short_dict[words[idx]]
    temp = " ".join(words).lower()
    return temp

def get_embedding(text):
    return model.encode(text)

def load_chunks(file_path):
    with open(file_path, "r", encoding="utf-8") as file:
        return json.load(file)
    
def get_question_embedding(question):
    return get_embedding(question)

def retrieve(ques, topk=3):
    ques_embedding = model.encode(tokenizer(ques))
    _, I = faiss_index.search(np.array([ques_embedding]), k=topk)
    return I[0].tolist()
