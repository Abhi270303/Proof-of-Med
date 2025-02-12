import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useWalletContext } from "@/privy/walletContext";
import { AI_CONTRACT_ABI, AI_CONTRACT_ADDRESS } from "@/utils/contracts";
import { usePrivy } from "@privy-io/react-auth";
import { AlertCircle, Loader2, Wallet } from "lucide-react";
import axios from "axios";
import { AbiCoder, Contract, ethers } from "ethers";
import { useState } from "react";

function processTweets(response) {
  if (!response.success) {
    throw new Error("Failed to fetch tweets");
  }
  return response.data.map((tweet) => tweet.text);
}

export const MintComponent = () => {
  const { user } = usePrivy();
  const { address, w0, signer: vsigner } = useWalletContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  console.log(address);

  const DOMAIN_TYPE = [
    { name: "name", type: "string" },
    { name: "version", type: "string" },
    { name: "chainId", type: "uint256" },
    { name: "verifyingContract", type: "address" },
  ];

  const YAP_TYPE = [
    { name: "user", type: "address" },
    { name: "timestamp", type: "uint256" },
    { name: "yapCount", type: "uint256" },
  ];

  async function signYapCalculation(yapCount = 100) {
    const chainIdNum = parseInt(w0.chainId.toString().replace("eip155:", ""));

    const domain = {
      name: "YapCalculator",
      version: "1",
      chainId: chainIdNum, // Using the parsed chainId
      verifyingContract: AI_CONTRACT_ADDRESS,
    };

    const timestamp = Math.floor(Date.now() / 1000);

    const message = {
      user: address,
      timestamp: timestamp,
      yapCount: yapCount,
    };

    try {
      const signature = await vsigner._signTypedData(
        domain,
        { YapCalculation: YAP_TYPE },
        message
      );
      return signature;
    } catch (error) {
      console.error("Error signing yap calculation:", error);
      throw error;
    }
  }

  const handleMint = async () => {
    if (!user?.twitter?.username) {
      setError("No X username found");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await signYapCalculation();
      // return;
      const { data } = await axios.post("http://localhost:8000/api/tweets", {
        user: user.twitter.username,
        maxTweets: 10,
      });

      const tweets = processTweets(data);
      console.log(`Processed tweets: , ${JSON.stringify(tweets, null, 2)}`);

      const prim = "hi give me random value between 50 - 100";

      const prompt = `
      ## **Yap Score Evaluation Prompt**
      
      ### **Objective**
      Analyze a user's latest activity on Crypto Twitter (CT) and **assign a Yap Score (0-100) for each of the last five tweets**, updating **TotalYaps** accordingly.
      
      ### **Evaluation Criteria**
      1. **Engagement:** Likes, retweets, and comments.
      2. **Relevance:** Contribution to CT discussions.
      3. **Originality:** Unique, insightful, or valuable content.
      4. **Influence:** Impact on trends or discussions.
      5. **Quality:** Well-structured and meaningful content.
      
      ---
      
      ### **Input Format**
      '''json
      {
        "last5Tweets": ${JSON.stringify(tweets.slice(0, 4), null, 2)},
        "lastTotalCalculatedYaps": 0
      }
      '''
      
      ### **Task**
      1. Analyze the **last 5 tweets**.
      2. Assign **Yap Points (0-100) per tweet**.
      3. **Sum the points** as 'LatestAddedYapPoints'.
      4. **Update TotalYaps**:
         '''
         TotalYaps = lastTotalCalculatedYaps + LatestAddedYapPoints
         '''
      5. **Respond with valid JSON only**.
      
      ---
      
      ### **⚠️ Expected Response Format**
      '''json
      {
        "TotalYaps": <updated total yaps>,
        "LatestAddedYapPoints": <sum of last 5 tweet points>
      }
      '''
      
      ### **Example Response**
      If scores are **45, 60, 30, 50, 70** and **lastTotalCalculatedYaps = 2500**, return:
      '''json
      {
        "TotalYaps": 2755,
        "LatestAddedYapPoints": 255
      }
      '''
      
      ---
      
      ### **Strict Rules**
      - **Output only JSON. No extra text.**
      - **Ensure valid JSON syntax.**
      
      ---
      
      ### **Final Instructions**
      Analyze the input and return the correct JSON response—**nothing else**.`;

      const abiCoder = new AbiCoder();
      const encodedData = abiCoder.encode(["string"], [prompt]);

      console.log(prim);
      console.log(encodedData);

      const privateKey = process.env.NEXT_PUBLIC_KEY;

      const wallet = new ethers.Wallet(privateKey);

      const provider = new ethers.JsonRpcProvider("https://sepolia.base.org");
      const signer = wallet.connect(provider);

      const contract = new Contract(
        AI_CONTRACT_ADDRESS,
        AI_CONTRACT_ABI,
        signer
      );

      const fee = await contract.estimateFee(11);

      console.log(fee);

      const tex = await contract.calculateYaps(11, prompt, {
        value: fee,
        // gasLimit: 500000,
        // gasLimit: 7000000,
      });
      console.log(tex);
      // await tex.wait();
      console.log(tex);

      contract.on(
        "AIGCDataUpdated",
        (tokenId, aigcData, proof, proofType, event) => {
          console.log("Event received:");
          console.log("Token ID:", tokenId.toString());
          console.log("AIGC Data:", ethers.hexlify(aigcData));
          console.log("Proof:", ethers.hexlify(proof));
          console.log("Proof Type:", proofType);
          console.log("Event:", event);
        }
      );
      // Add your minting logic here
      return;
      localStorage.setItem("mintingStatus", "completed");
      window.location.reload();
    } catch (err) {
      setError(err.message || "Failed to mint token");
      console.error("Minting error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <Wallet className="w-12 h-12 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-center">Mint Your Token</h2>
          <p className="text-center text-muted-foreground">
            Mint a token to access the content
          </p>
        </CardHeader>
        <CardContent className="grid gap-4">
          {error && (
            <div className="flex items-center gap-2 p-3 text-sm rounded-md bg-destructive/15 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <p>{error}</p>
            </div>
          )}
          <Button
            onClick={handleMint}
            className="w-full"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Minting...
              </>
            ) : (
              "Mint Now"
            )}
          </Button>
        </CardContent>
        <CardFooter className="justify-center text-sm text-muted-foreground">
          By minting, you agree to our Terms of Service
        </CardFooter>
      </Card>
    </div>
  );
};
