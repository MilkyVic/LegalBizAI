import React, { useState, useRef, useEffect } from 'react';
import ScaleLoader from 'react-spinners/ScaleLoader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessage } from '@fortawesome/free-regular-svg-icons';
import ReactMarkdown from 'react-markdown';
import robot_img from '../assets/ic5.png';
import { sendMessageChatService } from './chatbotService';
import LinkBox from './LinkBox'; 
import commonQuestionsData from '../db/commonQuestions.json'; 

function ChatBot(props) {
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const [timeOfRequest, setTimeOfRequest] = useState(0);
    const [promptInput, setPromptInput] = useState('');
    const [model, setModel] = useState('LegalBizAI_pro');
    const [chatHistory, setChatHistory] = useState([]);
    const [isLoading, setIsLoad] = useState(false);
    const [isGen, setIsGen] = useState(false);
    const [counter, setCounter] = useState(0);
    const [dataChat, setDataChat] = useState([
        [
            'start',
            [
                'Xin chào! Đây là LegalBizAI, trợ lý đắc lực về luật doanh nghiệp của bạn! Bạn muốn tìm kiếm thông tin về điều gì? Đừng quên chọn mô hình phù hợp để mình có thể giúp bạn tìm kiếm thông tin chính xác nhất nha.',
                null,
                null
            ],
        ],
    ]);
    const models = [
        {
            value: 'LegalBizAI_pro',
            name: 'LegalBizAI Pro',
        },
        {
            value: 'LegalBizAI',
            name: 'LegalBizAI',
        },
    ];

    const commonQuestions = commonQuestionsData;

    useEffect(() => {
        scrollToEndChat();
        inputRef.current.focus();
    }, [isLoading]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeOfRequest((timeOfRequest) => timeOfRequest + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        let interval = null;
        if (isLoading) {
            setCounter(1);
            interval = setInterval(() => {
                setCounter((prevCounter) => {
                    if (prevCounter < 30) {
                        return prevCounter + 1;
                    } else {
                        clearInterval(interval);
                        return prevCounter;
                    }
                });
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isLoading]);

    const scrollToEndChat = () => {
        messagesEndRef.current.scrollIntoView({ behavior: 'auto' });
    };

    // Hàm autoResize
    const autoResize = (textarea) => {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    };

    // Hàm onChangeHandler
    const onChangeHandler = (event) => {
        setPromptInput(event.target.value);
        autoResize(event.target);
    };

    const sendMessageChat = async () => {
        if (promptInput !== '' && isLoading === false) {
            setTimeOfRequest(0);
            setIsGen(true);
            setPromptInput('');
            inputRef.current.style.height = 'auto';
            setIsLoad(true);
            setDataChat((prev) => [...prev, ['end', [promptInput, model]]]);
            setChatHistory((prev) => [promptInput, ...prev]);

            try {
                const result = await sendMessageChatService(promptInput, model);
                setDataChat((prev) => [
                    ...prev,
                    ['start', [result.result, result.source_documents, result.references, model]],
                ]);
            } catch (error) {
                console.log(error);
                setDataChat((prev) => [
                    ...prev,
                    ['start', ['Lỗi, không thể kết nối với server', null, null]],
                ]);
            } finally {
                setIsLoad(false);
                setIsGen(false);
                inputRef.current.focus();
                
            }
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault(); // Ngăn chặn hành vi mặc định của sự kiện Enter
            sendMessageChat();
        }
    };

    const handleQuickQuestionClick = (question) => {
        const selectedQuestion = commonQuestions.find(q => q.question === question);
        if (selectedQuestion) {
            setDataChat(prev => [
                ...prev,
                ['end', [selectedQuestion.question, model]],
                ['start', [selectedQuestion.result, selectedQuestion.source_documents, selectedQuestion.references, model]]
            ]);
            setChatHistory(prev => [selectedQuestion.question, ...prev]);
            scrollToEndChat();
        }
    };

    return (
        <div
            className="bg-gradient-to-r from-orange-50 to-orange-100 flex flex-col"
            style={{ height: '87vh' }}
        >
            <style>
            {`
                .chat-bubble-gradient-receive {
                    background: linear-gradient(90deg, #f9c6c6 0%, #ffa98a 100%);
                    color: black;
                }
                .chat-bubble-gradient-send {
                    background: linear-gradient(90deg, #2c9fc3 0%, #2f80ed 100%);
                    color: white;
                }
                .input-primary {
                    border-color: #FFA07A;
                }
                .input-primary:focus {
                    outline: none;
                    border-color: #FF6347;
                    box-shadow: 0 0 5px #FF6347;
                }
                .btn-send {
                    background-color: #f8723c !important; 
                    border-color: #FFA07A !important; 
                }
                .btn-send:hover {
                    background-color: #ff9684 !important; 
                    border-color: #FF6347 !important; 
                }
                .textarea-auto-resize {
                    resize: none;
                    overflow: hidden;
                }
            `}
            </style>

            {/* Dropdown for model selection on mobile */}
            <div className="lg:hidden p-2 flex justify-center bg-gradient-to-r from-orange-50 to-orange-100">
                <select
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-3/4 p-2 border rounded-lg shadow-md bg-white"
                >
                    {models.map((model) => (
                        <option key={model.value} value={model.value}>{model.name}</option>
                    ))}
                </select>
            </div>

            <div className="hidden lg:block drawer-side absolute w-64 h-[20vh] left-3 mt-2 drop-shadow-md z-10">
                <div className="menu p-2 w-full min-h-full bg-gray-50 text-base-content rounded-2xl mt-3 overflow-auto scroll-y-auto max-h-[80vh]">
                    <ul className="menu text-sm">
                        <h2 className="font-bold mb-2 bg-[linear-gradient(90deg,hsl(var(--s))_0%,hsl(var(--sf))_9%,hsl(var(--pf))_42%,hsl(var(--p))_47%,hsl(var(--a))_100%)] bg-clip-text will-change-auto [-webkit-text-fill-color:transparent] [transform:translate3d(0,0,0)] motion-reduce:!tracking-normal max-[1280px]:!tracking-normal [@supports(color:oklch(0_0_0))]:bg-[linear-gradient(90deg,hsl(var(--s))_4%,color-mix(in_oklch,hsl(var(--sf)),hsl(var(--pf)))_22%,hsl(var(--p))_45%,color-mix(in_oklch,hsl(var(--p)),hsl(var(--a)))_67%,hsl(var(--a))_100.2%)]">
                            Lịch sử trò chuyện
                        </h2>
                        {chatHistory.length === 0 ? (
                            <p className="text-sm text-gray-500">
                                Hiện chưa có cuộc hội thoại nào
                            </p>
                        ) : (
                            chatHistory.map((mess, i) => (
                                <li key={i}>
                                    <p>
                                        <FontAwesomeIcon icon={faMessage} />
                                        {mess.length < 20
                                            ? mess
                                            : mess.slice(0, 20) + '...'}
                                    </p>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            </div>

            <div className="hidden lg:block drawer-side absolute w-64 h-[20vh] mt-2 right-3 drop-shadow-md z-10">
                <div className="menu p-2 w-full min-h-full bg-gray-50 text-base-content rounded-2xl mt-3">
                    <h2 className="font-bold text-sm mb-2 bg-[linear-gradient(90deg,hsl(var(--s))_0%,hsl(var(--sf))_9%,hsl(var(--pf))_42%,hsl(var(--p))_47%,hsl(var(--a))_100%)] bg-clip-text will-change-auto [-webkit-text-fill-color:transparent] [transform:translate3d(0,0,0)] motion-reduce:!tracking-normal max-[1280px]:!tracking-normal [@supports(color:oklch(0_0_0))]:bg-[linear-gradient(90deg,hsl(var(--s))_4%,color-mix(in_oklch,hsl(var(--sf)),hsl(var(--pf)))_22%,hsl(var(--p))_45%,color-mix(in_oklch,hsl(var(--p)),hsl(var(--a)))_67%,hsl(var(--a))_100.2%)]">
                        Chọn Mô hình
                    </h2>
                    <ul className="menu">
                        {models.map((item) => (
                            <li key={item.value}>
                                <label className="label cursor-pointer">
                                    <span className="label-text font-medium">
                                        {item.name}
                                    </span>
                                    <input
                                        type="radio"
                                        name="radio-10"
                                        value={item.value}
                                        checked={model === item.value}
                                        onChange={(e) =>
                                            setModel(e.target.value)
                                        }
                                        className="radio checked:bg-blue-500"
                                    />
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>
                <div
                    className="menu p-2 w-full min-h-full bg-gray-50 text-base-content 
            rounded-2xl mt-3 overflow-auto scroll-y-auto"
                    style={{ maxHeight: '60vh' }} // Adjust this value to increase the height
                >
                    <ul className="menu text-sm">
                        <h2 className="font-bold mb-2 bg-[linear-gradient(90deg,hsl(var(--s))_0%,hsl(var(--sf))_9%,hsl(var(--pf))_42%,hsl(var(--p))_47%,hsl(var(--a))_100%)] bg-clip-text will-change-auto [-webkit-text-fill-color:transparent] [transform:translate3d(0,0,0)] motion-reduce:!tracking-normal max-[1280px]:!tracking-normal [@supports(color:oklch(0_0_0))]:bg-[linear-gradient(90deg,hsl(var(--s))_4%,color-mix(in_oklch,hsl(var(--sf)),hsl(var(--pf)))_22%,hsl(var(--p))_45%,color-mix(in_oklch,hsl(var(--p)),hsl(var(--a)))_67%,hsl(var(--a))_100.2%)]">
                            Những câu hỏi phổ biến
                        </h2>

                        {commonQuestions.map((mess, i) => (
                            <li key={i} onClick={() => handleQuickQuestionClick(mess.question)}>
                                <p className="max-w-64">
                                    <FontAwesomeIcon icon={faMessage} />
                                    {mess.question}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="flex flex-col h-full items-center relative z-0 flex-grow">
                <div
                    id="chat-area"
                    className="
          mt-2 lg:mt-5 text-xs lg:text-sm 
          scrollbar-thin scrollbar-thumb-gray-300 bg-white  
          scrollbar-thumb-rounded-full scrollbar-track-rounded-full
          rounded-3xl border-2 md:w-[50%] md:p-3 p-1 w-full overflow-auto scroll-y-auto flex-grow"
                    style={{ maxHeight: 'calc(90vh - 91px)' }} // Adjust this value based on the footer height
                >
                    {dataChat.map((dataMessages, i) =>
                        dataMessages[0] === 'start' ? (
                            <div
                                className="chat chat-start drop-shadow-md"
                                key={i}
                            >
                                <div className="chat-image avatar">
                                    <div className="w-8 lg:w-10 rounded-full border-2 border-blue-500">
                                        <img
                                            className="scale-150"
                                            src={robot_img}
                                            alt="avatar"
                                        />
                                    </div>
                                </div>
                                <div className="chat-bubble chat-bubble-gradient-receive break-words">
                                    <ReactMarkdown>
                                        {dataMessages[1][0]}
                                    </ReactMarkdown>
                                    {dataMessages[1][1] && dataMessages[1][1].length > 0 && (
                                        <>
                                            <div className="divider m-0"></div>
                                            <LinkBox links={dataMessages[1][1]} />
                                        </>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="chat chat-end" key={i}>
                                <div className="chat-bubble shadow-xl chat-bubble-gradient-send">
                                    {dataMessages[1][0]}

                                    <>
                                        <div className="divider m-0"></div>
                                        <p className="font-light text-xs text-cyan-50">
                                            Mô hình: {dataMessages[1][1]}
                                        </p>
                                    </>
                                </div>
                            </div>
                        )
                    )}
                    {isLoading && (
                        <div className="chat chat-start">
                            <div className="chat-image avatar">
                                <div className="w-8 lg:w-10 rounded-full border-2 border-blue-500">
                                    <img src={robot_img} alt="avatar" />
                                </div>
                            </div>
                            <div className="flex justify-start px-4 py-2">
                                <div className="chat-bubble chat-bubble-gradient-receive break-words flex items-center">
                                    <ScaleLoader
                                        color="#0033ff"
                                        loading={true}
                                        height={15}
                                    />
                                    <span className="ml-2">{`${counter}/30s`}</span>{' '}
                                    {/* Hiển thị bộ đếm cùng hàng */}
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                <div
                    className="grid md:w-[50%] bg-gradient-to-r from-orange-50 to-orange-100 p-1 rounded-t-lg hide-on-small-screen"
                    style={{ zIndex: 10 }}
                >
                    <textarea
                        placeholder="Nhập câu hỏi tại đây..."
                        className="mr-1 shadow-xl border-2 focus:outline-none px-2 rounded-2xl input-primary col-start-1 md:col-end-12 col-end-11 textarea-auto-resize"
                        onChange={onChangeHandler}
                        onKeyDown={handleKeyDown}
                        disabled={isGen}
                        value={promptInput}
                        ref={inputRef}
                        rows="1"
                        style={{ resize: 'none', overflow: 'hidden', lineHeight: '3'}}                    
                    />
                    <button
                        disabled={isGen}
                        onClick={sendMessageChat}
                        className={
                            'drop-shadow-md md:col-start-12 rounded-2xl col-start-11 col-end-12 md:col-end-13 btn btn-active btn-primary btn-square btn-send'
                        }
                    >
                        <svg
                            stroke="currentColor"
                            fill="none"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            color="white"
                            height="15px"
                            width="15px"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <line x1="22" y1="2" x2="11" y2="13"></line>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                    </button>
                    <p className="text-xs col-start-1 col-end-12 text-justify p-1">
                        <b>Lưu ý: </b>LegalBizAI có thể mắc lỗi. Hãy kiểm tra
                        các thông tin quan trọng!
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ChatBot;