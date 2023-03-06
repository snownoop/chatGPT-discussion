import Image from "next/image";
import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [apiKey, setApiKey] = useState("");
  const [messageFor1, setMessageFor1] = useState("");
  const [messageFor2, setMessageFor2] = useState("");
  const [numberOfMessages, setNumberOfMessages] = useState(null);
  const [delay, setDelay] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    let data;
    try {
      setLoading(true);
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          apiKey,
          messageFor1,
          messageFor2,
          delay,
          numberOfMessages,
        }),
      });

      data = await response.json();
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }
      setResult(data.result);
      setLoading(false);
    } catch (error) {
      // Consider implementing your own error handling logic here
      setLoading(false);
      alert(data.result ?? error.message);
    }
  }

  const renderResult = () =>
    result[1].map((msg, index) => (
      <div className={styles.msgBlock}>
        <div className={styles.msg}>
          Robot1: <span className={styles.msgText}>{msg}</span>
        </div>
        <div className={styles.msg}>
          Robot2: <span className={styles.msgText}>{result[2][index]}</span>
        </div>
      </div>
    ));

  return (
    <div>
      <Head>
        <title>Robots chat</title>
      </Head>

      <main className={styles.main}>
        <h3>Robots Chat</h3>
        <form onSubmit={onSubmit}>
          <label htmlFor="apiKey">
            Your ChatGPT API key (
            <a href="https://platform.openai.com/account/api-keys">link</a>)
          </label>
          <input
            type="password"
            name="apiKey"
            id="apiKey"
            placeholder="Your api key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />

          <label htmlFor="messageFor1">First message to Robot #1</label>
          <textarea
            name="messageFor1"
            id="messageFor1"
            rows="5"
            placeholder="All you messages should be not more than 10 words, behave like a human to discuss a topic. Let's discuss Bitcoin, What are your toughts ?"
            value={messageFor1}
            onChange={(e) => setMessageFor1(e.target.value)}
          />

          <label htmlFor="messageFor2">
            First message prefix to Robot #2 (answer from Robot #1 will be
            attached to this)
          </label>
          <textarea
            name="messageFor2"
            id="messageFor2"
            rows="5"
            placeholder="All you messages should be not more than 10 words, behave like a human to discuss a topic. Act as a bitcoin hater and altcoin fan. Let me start discussion"
            value={messageFor2}
            onChange={(e) => setMessageFor2(e.target.value)}
          />

          <label htmlFor="numberOfMessages">Maximum number of messages</label>
          <input
            type="number"
            name="numberOfMessages"
            id="numberOfMessages"
            placeholder="10"
            value={numberOfMessages}
            onChange={(e) => setNumberOfMessages(e.target.value)}
          />

          <label htmlFor="delay">
            Delay between messages (As there is ~750 words limit for free
            chatGPT API usage)
          </label>
          <input
            type="number"
            name="delay"
            id="delay"
            placeholder="60"
            value={delay}
            onChange={(e) => setDelay(e.target.value)}
          />

          <input type="submit" value="Start chat" />
        </form>
        {loading && (
          <div className={styles.backdrop_wrapper}>
            <div className={styles.loading}>
              <div className={styles.loadingTitle}>In progress...</div>
              Your robots are speaking with each other. Result will be shown on
              this page once finished. <br />
              Depending on numbers of messages and delay you use it can take
              time.
              <span className={styles.loadingTime}>
                ((numbers of messages * delay) seconds)
              </span>
            </div>
            <div className={styles.backdrop} />
          </div>
        )}
        {result && (
          <div className={styles.result}>
            <h3>Chat results:</h3>
            {renderResult()}
          </div>
        )}
      </main>
    </div>
  );
}
