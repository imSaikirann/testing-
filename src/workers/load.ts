import autocannon, { Result } from "autocannon";

const run = async () => {
  const instance = autocannon({
    url: "http://localhost:4000/api/v1",
    method: "GET",

    // 👇 EXACT CONTROL
    amount: 100,        // total requests
    duration: 120,      // 2 minutes
    connections: 10,     // keep low to avoid burst

  });

  // LIVE BENCHMARK OUTPUT
  autocannon.track(instance as any, {
    renderProgressBar: true,
    renderResultsTable: true,
  });

  // FINAL REPORT
  instance.then((result: Result) => {
    console.log("\n-------- Final Report --------");
    console.log(`Total Requests : ${result.requests.total}`);
    console.log(`Avg RPS        : ${result.requests.average}`);
    console.log(`Max RPS        : ${result.requests.max}`);
    console.log(`Errors         : ${result.errors}`);
    console.log(`Timeouts       : ${result.timeouts}`);
    console.log(`Latency (avg)  : ${result.latency.average} ms`);
    console.log(
      `Throughput     : ${(result.throughput.average / 1024).toFixed(2)} KB/s`
    );
    console.log("------------------------------\n");

    process.exit(0);
  });
};

run();
