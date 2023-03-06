import { ChatGPTAPI } from "chatgpt";

let result = {};
let api;
let api_second;
let counter = 0;
let parentMessageId = null;
let parentMessageId_second = null;
let message = null;

const chat = async (res, messageFor1, messageFor2, numberOfMessages, delay) => {
  let data;
  let data_second;
  try {
    data = await api.sendMessage(counter === 0 ? messageFor1 : message, {
      parentMessageId: parentMessageId,
    });
    parentMessageId = data.id;
    message = data.text;
    result[1] = Array.isArray(result[1])
      ? result[1].concat(data.text)
      : [data.text];
  } catch (error) {
    res.status(500).json({
      result: error.message,
    });
  }

  // ------ 2nd --------
  try {
    data_second = await api_second.sendMessage(
      counter === 0 ? `${messageFor2} ${message}` : message,
      {
        parentMessageId: parentMessageId_second,
      }
    );
    parentMessageId_second = data_second.id;
    message = data_second.text;
    result[2] = Array.isArray(result[2])
      ? result[2].concat(data_second.text)
      : [data_second.text];
    counter += 1;
    setTimeout(() => {
      if (counter !== parseInt(numberOfMessages)) {
        chat(res, null, null, numberOfMessages, delay);
      } else {
        res.status(200).json({ result });
      }
    }, parseInt(delay) * 1000);
  } catch (error) {
    res.status(500).json({
      result: error.message,
    });
  }
};

export default async function (req, res) {
  const { apiKey, messageFor1, messageFor2, numberOfMessages, delay } =
    req.body;
  result = {};
  api = null;
  api_second = null;
  counter = 0;
  parentMessageId = null;
  parentMessageId_second = null;
  message = null;
  if (!apiKey || !messageFor1 || !numberOfMessages || !delay) {
    res.status(500).json({
      result:
        "Please provide values for Api Key, Message for Robot 1, Number of messages and Delay seconds",
    });
  } else {
    try {
      api = new ChatGPTAPI({ apiKey });
      api_second = new ChatGPTAPI({ apiKey });
    } catch (error) {
      res.status(500).json({
        result:
          "Failed to connect to ChatGPT. Most probably API Key is invalid",
      });
    }
    chat(res, messageFor1, messageFor2, numberOfMessages, delay);
  }
}
