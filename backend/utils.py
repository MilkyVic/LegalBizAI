import orjson
import re
from retrieval.retrieve import retrieve
import asyncio
from concurrent.futures import ThreadPoolExecutor
from functools import wraps

with open("./prompt_tempt_v2.txt", "r", encoding="utf-8") as f_template:
    PROMPT_TEMPLATE = f_template.read()

def make_async(sync_func):
    @wraps(sync_func)
    async def async_wrapper(*args, **kwargs):
        loop = asyncio.get_event_loop()
        with ThreadPoolExecutor() as pool:
            return await loop.run_in_executor(pool, sync_func, *args, **kwargs)

    return async_wrapper

class ChunkLoader:
    def __init__(self, chunk_path) -> None:
        with open(chunk_path, "rb") as f_data:
            self._data = orjson.loads(f_data.read())

    def __getitem__(self, key):
        return self._data[key]
    
chunk_data = ChunkLoader("./data/all_chunks_final.json")

class RetrieveContent:
    def __init__(self, message):
        self.message = message
        self.retrived_chunks = retrieve(message)
    def get_true_references(self, message):
        origin_chunk = [chunk_data[each] for each in self.retrived_chunks]
        true_references = {each["title"] :each["quote"] for each in origin_chunk}
        true_references = [dict(title=title, link=link) for title, link in true_references.items()]
        model_answer = message.lower()
        referennces = []
        for each in true_references:
            temp = each["title"].lower().split()
            article, doc_name = " ".join(temp[:2]), " ".join(temp[2:])
            article_match = re.findall(fr"{article}" ,model_answer)
            doc_name_match = re.findall(fr"{doc_name}", model_answer)
            if article_match and doc_name_match:
                referennces.append({"title": each["title"],
                                    "link" : each["link"]})
        
        resp = {"result":message,
                "source_documents":referennces,
                "references":None}

        return resp
    def get_prompt(self):
        law_content = get_law_content(chunk_data._data, self.retrived_chunks)

        prompt = PROMPT_TEMPLATE.format(
            question= self.message,
            answer="",
            law_content=law_content,
        )
        return prompt



def split_consecutive_groups(lst, chunk_data):

    groups = []
    current_group = []

    for each in lst:
        if not current_group:
            current_group.append(each)
            current_title = chunk_data[each]["title"]
        else:
            if chunk_data[each]["title"] == current_title:
                current_group.append(each)
            else:
                groups.append(current_group)
                current_group = [each]
                current_title = chunk_data[each]["title"]
    groups.append(current_group)
    return groups


def get_law_content(chunks: list[dict], chunk_ids: list[int]) -> str:
    """
    description: get the full article passage of a chunk by id

    input:
        chunks: list of chunk objects
        chunk_ids: list of chunk ids to be retrieved passage
    output:
        tuple: (concatenation of articles passage, all article chunk ids)

    notes:
        Article: Điều
        Clause: Khoản
        Point: Điểm
    """

    articles_ids = set()
    for chunk_id in chunk_ids:

        if chunk_id in articles_ids:
            continue
        articles_ids.add(chunk_id)
        chunk_title = chunks[chunk_id]["title"]

        run_id = chunk_id - 1
        while run_id >= 0 and chunks[run_id]["title"] == chunk_title:
            articles_ids.add(run_id)
            run_id -= 1
        run_id = chunk_id + 1
        while run_id < len(chunks) and chunks[run_id]["title"] == chunk_title:
            articles_ids.add(run_id)
            run_id += 1
    articles_ids = sorted(articles_ids)
    articles = split_consecutive_groups(articles_ids, chunks)

    contents = []
    for each in articles:
        doc_name = chunks[each[0]]["root"]
        title = chunks[each[0]]["passage"].split("\n")[0].strip()
        content = ["*"+ "\n\n".join(chunks[id]["passage"].split("\n")[1:]) +"*" if id in chunk_ids else "\n\n".join(chunks[id]["passage"].split("\n")[1:]) for id in each]
        contents.append((doc_name,(f"{title}\n\n" + "\n\n".join(content))))
    pre_doc_name = ""
    final = ""
    for passage in contents:
        if not final:
            pre_doc_name = passage[0]
            final = f"{pre_doc_name}\n\n{passage[1]}\n"
        else:
            if passage[0] == pre_doc_name:
                final += f"\n{passage[1]}\n"
            else:
                pre_doc_name = passage[0]
                final += f"---\n{pre_doc_name}\n\n{passage[1]}"
    return final
            
        



