// Listing 1. Understanding callbacks: simulating asynchronous ASR .

console.log("Before sending audio for transcription");

// 1. Simulate transcribing an audio file, which takes time
function transcribeAudioFile(audioId, callback) {
  console.log(`ASR System: Starting transcription for audio chunk ${audioId}...`);
  setTimeout(() => {
    // Transcription is ready after 2 seconds
    const transcriptionResult = {
      id: audioId,
      text: "Hello world this is a test transcription.",
      confidence: 0.95
    };
    console.log("ASR System: Transcription complete.");
    callback(transcriptionResult); // Call the callback function with the result
  }, 2000); // 2000 milliseconds = 2 seconds
}
// Listing 2. Callbacks in action.

// Call to the ASR System
transcribeAudioFile("audio_chunk_001", (result) => {
  console.log("Callback: Received transcription!");
  console.log("Transcription:", result);
});

console.log("After sending audio for transcription (but before it's done)");
// Listing 3. The asynchronous output sequence.

/*
Expected Output:
Before sending audio for transcription
ASR System: Starting transcription for audio chunk audio_chunk_001...
After sending audio for transcription (but before it's done)
// (after 2 seconds)
ASR System: Transcription complete.
Callback: Received transcription!
Transcription: {
  id: 'audio_chunk_001',
  text: 'Hello world this is a test transcription.',
  confidence: 0.95
}
*/
///////////////////////////////////////////////////////////////////////
// Listing 4. Text post-processing.

// --- 2. Text Postprocessing ---

function postProcessText(rawText, callback) {
    console.log(`Postprocessor Service: Normalizing text: "${rawText.substring(0, 30)}..."`);
    setTimeout(() => {
      // Simulate number normalization (e.g., "five" -> "5")
      let processedText = rawText.replace(/\bfive\b/gi, "5");
      console.log("Postprocessor Service: Text normalization complete.");
      callback(processedText);
    }, 1500); // 1.5 seconds for post-processing
  }
// Listing 5. Sentiment analysis.

  // 3. Sentiment Analysis
  function analyzeTextSentiment(processedText, callback) {
    console.log(`Sentiment Analysis: Analyzing text: "${processedText.substring(0, 30)}..."`);
    setTimeout(() => {
      let sentiment = "neutral"; // Fixed for now
      console.log("Sentiment Analysis: Analysis complete.");
      callback(sentiment);
    }, 2000); // 2 seconds for sentiment analysis
  }
// Listing 6. Nested calls.

  // --- 4. The nested calls demonstrating the pipeline ---
  console.log("Starting ASR & NLP processing pipeline...");
  
  transcribeAudioFile("meeting_audio_003", (asrResult) => {
    console.log("Step 1: Raw Transcription received:", asrResult.text);
    postProcessText(asrResult.text, (processedText) => {
      console.log("Step 2: Post-processed text:", processedText);
      analyzeTextSentiment(processedText, (sentiment) => {
        console.log("Step 3: Sentiment analyzed:", sentiment);
        console.log("ASR & NLP processing pipeline complete.");
      });
    });
  });
  
  console.log("Initiated pipeline... (main thread continues its work)");
// Listing 7. Output of nested callback pipeline.

  /*
  Expected Output:
  Before sending audio for processing pipeline
  Starting ASR & NLP processing pipeline...
  ASR System: Starting transcription for audio meeting_audio_003...
  Initiated pipeline... (main thread continues its work)
  // (after ~2 seconds)
  ASR System: Raw transcription complete.
  Step 1: Raw Transcription received: hello world this is a test it cost five dollars and was great
  Postprocessor Service: Normalizing text: "hello world this is a test it..."
  // (after another ~1.5 seconds, total ~3.5s)
  Postprocessor Service: Text normalization complete.
  Step 2: Post-processed text: Hello world this is a test it cost 5 dollars and was great
  Sentiment Analysis: Analyzing text: "Hello world this is a test it..."
  // (after another ~2 seconds, total ~5.5s)
  Sentiment Analysis: Analysis complete.
  Step 3: Sentiment analyzed: neutral
  ASR & NLP processing pipeline complete.
  */
/////////////////////////////////////////////////////////////////////////////////////
// Listing 8. ASR system with a future value.

console.log("Before initiating ASR");

// Service 1: ASR System returning a Promise
function transcribeAudioFilePromise(audioId) {
  // Return a new Promise object
  return new Promise((resolve, reject) => {
    console.log(`ASR System (Promise): Starting transcription for audio ${audioId}...`);
    setTimeout(() => {
      // Simulate successful transcription
      const rawTranscriptionResult = {
        id: audioId,
        text: "hello world this is a test it cost five dollars and was great",
        confidence: 0.93
      };
      console.log(`ASR System (Promise): Raw transcription complete for ${audioId}.`);
      // Fulfill the promise with the result object
      resolve(rawTranscriptionResult);

      // To simulate an error, you would call reject instead:
      // reject(new Error(`ASR failed for audio ${audioId}: Network timeout`));
    }, 2000); // Simulate 2 seconds for ASR
  });
}

// Listing 9. Consuming the ASR result with .then() and .catch().

// Consuming the Promise
console.log("Requesting transcription for audio_promise_001...");
const transcriptionPromise = transcribeAudioFilePromise("audio_promise_001");

// Attach handlers for when the promise settles
transcriptionPromise
  .then((result) => {
    // This function runs if the promise is 'fulfilled' (resolved successfully)
    console.log("Promise fulfilled: Transcription received!");
    console.log("Result:", result);
  })
  .catch((error) => {
    // This function runs if the promise is 'rejected' (an error occurred)
    console.error("Promise rejected: ASR Error!");
    console.error(error.message);
  });

console.log("After initiating ASR (Promise pending)");
// Listing 10. Output of an asynchronous ASR operation.

/*
Expected Output:
Before initiating ASR
Requesting transcription for audio_promise_001...
ASR System (Promise): Starting transcription for audio audio_promise_001...
After initiating ASR (Promise pending)
// (after 2 seconds)
ASR System (Promise): Raw transcription complete for audio_promise_001.
Promise fulfilled: Transcription received!
Result: {
  id: 'audio_promise_001',
  text: 'hello world this is a test it cost five dollars and was great',
  confidence: 0.93
}
*/
/////////////////////////////////////////////////////////////////////////////////
// Listing 11. Text postprocessor returning a promise.

// --- Assume transcribeAudioFilePromise exists from above ---

// Service 2: Text Postprocessor returning a Promise
function postProcessTextPromise(rawTextObject) {
    return new Promise((resolve, reject) => {
      const rawText = rawTextObject.text;
      console.log(`Postprocessor (Promise): Normalizing text: "${rawText.substring(0, 30)}..."`);
      setTimeout(() => {
        let processedText = rawText.replace(/\bfive\b/gi, "5");
        console.log("Postprocessor (Promise): Text normalization complete.");
        resolve(processedText); // Resolve with the cleaned text
        // Or reject(new Error("Postprocessing failed: Invalid input format"));
      }, 1500); // 1.5 seconds
    });
  }

  // Listing 12. Sentiment analysis returning a promise.
  
  // Service 3: Sentiment Analysis returning a Promise
  function analyzeTextSentimentPromise(processedText) {
    return new Promise((resolve, reject) => {
      console.log(`Sentiment Analysis (Promise): Analyzing: "${processedText.substring(0, 30)}..."`);
      setTimeout(() => {
        let sentiment = "neutral";
        console.log("Sentiment Analysis (Promise): Analysis complete.");
        resolve(sentiment); // Resolve with the sentiment
        // Or reject(new Error("Sentiment analysis service unavailable"));
      }, 2000); // 2 seconds
    });
  }
  
  console.log("Starting ASR/NLP Promise chain...");
  
  // Listing 13. Cleaner asynchronous workflow through promise chaining .
  
  transcribeAudioFilePromise("meeting_chain_004")
    .then(asrResult => {
      // 1. ASR finished, result is asrResult
      console.log("Chain Step 1: Raw Transcription received:", asrResult.text);
      // Return the *next* promise in the sequence
      return postProcessTextPromise(asrResult);
    })
    .then(processedText => {
      // 2. Postprocessing finished, result is processedText
      console.log("Chain Step 2: Post-processed text:", processedText);
      // Return the *next* promise
      return analyzeTextSentimentPromise(processedText);
    })
    .then(sentiment => {
      // 3. Sentiment analysis finished, result is sentiment
      console.log("Chain Step 3: Sentiment analyzed:", sentiment);
      console.log("--- ASR/NLP Promise chain complete. ---");
    })
    .catch(error => {
      // Single catch block handles errors from ANY preceding step in the chain
      console.error("Error encountered in ASR/NLP Promise chain:", error.message);
    });
  
  console.log("Initiated ASR/NLP Promise chain... (execution continues)");
  ////////////////////////////////////////////////////////////////////////////
  // Listing 14. Defining a synchronous-style pipeline.

// --- Assume transcribeAudioFilePromise, postProcessTextPromise, ---
// --- analyzeTextSentimentPromise still exist from the Promise example ---
// (These are the same Promise-returning functions used before)

// We must wrap our await calls in an 'async' function
async function processAudioPipeline(audioId) {
    // Use a try...catch block for standard error handling
    try {
      console.log(`Starting async/await pipeline for audio: ${audioId}...`);
  
      // 1. Transcribe Audio
      // 'await' pauses the execution *inside this function* until the promise resolves
      const asrResult = await transcribeAudioFilePromise(audioId);
      // Once resolved, the result is assigned to asrResult, and execution continues
      console.log("Pipeline Step 1: Raw Transcription received:", asrResult.text);
  
      // 2. Post-Process Text
      // Pause again until post-processing is done
      const processedText = await postProcessTextPromise(asrResult);
      console.log("Pipeline Step 2: Post-processed text:", processedText);
  
      // 3. Analyze Sentiment
      // Pause again for sentiment analysis
      const sentiment = await analyzeTextSentimentPromise(processedText);
      console.log("Pipeline Step 3: Sentiment analyzed:", sentiment);
  
      console.log(`--- Async/await ASR/NLP pipeline complete for ${audioId}. ---`);
      // If the async function needs to return the final result:
      // return { transcription: processedText, sentiment: sentiment };
  
    } catch (error) {
      // Catch any error (rejected Promise) from ANY 'await'ed step above
      console.error(`Error in async/await pipeline for ${audioId}:`, error.message);
      // You might want to throw the error or return an error indicator
      // throw error;
    }
  }
  
  // Listing 15. Launching the Async pipeline.
  
  console.log("Before calling async pipeline function");
  // Call the async function. Note that the call itself is non-blocking
  processAudioPipeline("meeting_async_005");
  console.log("After calling async pipeline function (pipeline is running in the background)");
  
  /*
  Expected Output:
  Before calling async pipeline function
  Starting async/await pipeline for audio: meeting_async_005...
  ASR System (Promise): Starting transcription for audio meeting_async_005...
  After calling async pipeline function (pipeline is running in the background)
  // (after ~2 seconds)
  ASR System (Promise): Raw transcription complete for meeting_async_005.
  Pipeline Step 1: Raw Transcription received: hello world this is a test it cost five dollars and was great
  Postprocessor (Promise): Normalizing text: "hello world this is a test it..."
  // (after another ~1.5 seconds, total ~3.5s)
  Postprocessor (Promise): Text normalization complete.
  Pipeline Step 2: Post-processed text: Hello world this is a test it cost 5 dollars and was great
  Sentiment Analysis (Promise): Analyzing: "Hello world this is a test it..."
  // (after another ~2 seconds, total ~5.5s)
  Sentiment Analysis (Promise): Analysis complete.
  Pipeline Step 3: Sentiment analyzed: neutral
  --- Async/await ASR/NLP pipeline complete for meeting_async_005. ---
  */


