const dataFAQs = [
  [
    "Phạm vi kiến thức của LegalBizAI là gì?",
    "Phạm vi kiến thức của chatbot tập trung vào Luật Doanh nghiệp 2020, cung cấp thông tin hữu ích về các quy định thành lập, quản lý và vận hành doanh nghiệp tại Việt Nam. Sản phẩm này đặc biệt phù hợp cho các doanh nhân, nhà đầu tư, kế toán, luật sư, chuyên viên pháp chế, sinh viên luật, và bất kỳ ai quan tâm đến lĩnh vực kinh doanh và muốn tìm hiểu về luật doanh nghiệp."
  ],
  [
    "Cách sử dụng LegalBizAI để tra cứu thông tin",
    "Để sử dụng LegalBizAI một cách hiệu quả nhất bạn nên đặt câu hỏi một cách rõ ràng đầy đủ để mô hình có thể đưa ra câu trả lời chính xác. Tuy nhiên, ở một số trường hợp câu trả lời có thể không chính xác nên bạn phải kiểm chứng thông tin hoặc liên hệ hỗ trợ nếu cần thiết."
  ],
  [
    "Thông tin từ LegalBizAI có đáng tin cậy không?",
    "Vì là một mô hình xác suất nên thông tin LegalBizAI đưa ra có thể không chính xác ở một số trường hợp, bạn nên kiểm chứng thông tin hoặc liên hệ hỗ trợ nếu cần thiết."
  ],
  [
    "Tôi có thể liên hệ hỗ trợ như thế nào?",
    "Vui lòng vào phần Góp ý/báo lỗi hoặc liên hệ với bộ phận pháp lý của công ty bạn để được hỗ trợ thêm."
  ]
];

function FAQPage() {
  return (
    <div className="flex justify-center min-h-[85vh] h-auto bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="md:w-[50%]">
        <h1 className="text-3xl text-center font-bold p-5 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-600">
          Những câu hỏi thường gặp (FAQs)
        </h1>
        {dataFAQs.map((item, i) => (
          <div key={i} className="mt-2 collapse collapse-plus shadow-md rounded-xl bg-white">
            <input type="checkbox" />
            <div className="collapse-title text-base font-medium">
              {item[0]}
            </div>
            <div className="collapse-content">
              <p>{item[1]}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FAQPage;
