"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import {
  Wallet,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Loader2,
  ExternalLink,
  Github,
  Info,
  ArrowLeft,
  Home,
} from "lucide-react"

type TransactionStatus = "idle" | "connecting" | "swapping" | "sending" | "success" | "error"
type Step = "swap" | "send" | "confirm"

interface SwapBridgeAppProps {
  onBack: () => void
}

export default function SwapBridgeApp({ onBack }: SwapBridgeAppProps) {
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [currentStep, setCurrentStep] = useState<Step>("swap")
  const [txStatus, setTxStatus] = useState<TransactionStatus>("idle")
  const [progress, setProgress] = useState(0)

  // Form state
  const [ethAmount, setEthAmount] = useState("")
  const [selectedToken, setSelectedToken] = useState("ETH-USDC")
  const [stellarAddress, setStellarAddress] = useState("")
  const [memo, setMemo] = useState("")
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  // Simulate wallet connection
  const connectWallet = async () => {
    setTxStatus("connecting")
    setProgress(25)

    // Simulate MetaMask connection
    setTimeout(() => {
      setIsWalletConnected(true)
      setWalletAddress("0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4")
      setTxStatus("idle")
      setProgress(0)
      toast({
        title: "Wallet Connected",
        description: "MetaMask wallet connected successfully",
      })
    }, 2000)
  }

  // Form validation
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!ethAmount || Number.parseFloat(ethAmount) <= 0) {
      newErrors.ethAmount = "Please enter a valid ETH amount"
    }

    if (!stellarAddress) {
      newErrors.stellarAddress = "Stellar address is required"
    } else if (stellarAddress.length < 56) {
      newErrors.stellarAddress = "Invalid Stellar address format"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle swap transaction
  const handleSwap = async () => {
    if (!validateForm()) return

    setTxStatus("swapping")
    setProgress(0)

    // Simulate swap progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTxStatus("idle")
          setCurrentStep("send")
          toast({
            title: "Swap Successful",
            description: `${ethAmount} ETH converted to USDC`,
          })
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  // Handle send transaction
  const handleSend = async () => {
    setTxStatus("sending")
    setProgress(0)
    setCurrentStep("confirm")

    // Simulate send progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTxStatus("success")
          toast({
            title: "Transaction Complete",
            description: "USDC sent to Stellar network successfully",
          })
          return 100
        }
        return prev + 8
      })
    }, 400)
  }

  // Navigation functions
  const goBack = () => {
    if (currentStep === "send") {
      setCurrentStep("swap")
      setTxStatus("idle")
      setProgress(0)
    } else if (currentStep === "confirm") {
      setCurrentStep("send")
      setTxStatus("idle")
      setProgress(0)
    }
  }

  const resetTransaction = () => {
    setTxStatus("idle")
    setProgress(0)
    setCurrentStep("swap")
    setEthAmount("")
    setStellarAddress("")
    setMemo("")
    setErrors({})
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={onBack} className="text-slate-400 hover:text-white">
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
                <ArrowRight className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                SwapBridge Pay
              </h1>
            </div>
          </div>

          {!isWalletConnected ? (
            <Button
              onClick={connectWallet}
              disabled={txStatus === "connecting"}
              className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white border-0"
            >
              {txStatus === "connecting" ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Wallet className="w-4 h-4 mr-2" />
                  Connect Wallet
                </>
              )}
            </Button>
          ) : (
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                <CheckCircle className="w-3 h-3 mr-1" />
                Connected
              </Badge>
              <span className="text-sm text-slate-400">
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </span>
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Step Indicator */}
        <div className="mb-8">
          <Tabs value={currentStep} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-slate-800 border border-slate-700">
              <TabsTrigger
                value="swap"
                className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white"
                disabled={!isWalletConnected}
              >
                1. Swap
              </TabsTrigger>
              <TabsTrigger
                value="send"
                className="data-[state=active]:bg-purple-500 data-[state=active]:text-white"
                disabled={currentStep === "swap"}
              >
                2. Send
              </TabsTrigger>
              <TabsTrigger
                value="confirm"
                className="data-[state=active]:bg-pink-500 data-[state=active]:text-white"
                disabled={currentStep !== "confirm"}
              >
                3. Confirm
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Main Form Card */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white">Cross-Chain Payment</CardTitle>
            <CardDescription className="text-slate-400">Swap ETH to USDC and send to Stellar network</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {!isWalletConnected ? (
              <div className="text-center py-8">
                <Wallet className="w-16 h-16 mx-auto text-slate-600 mb-4" />
                <p className="text-slate-400 mb-4">Connect your wallet to get started</p>
                <Button
                  onClick={connectWallet}
                  disabled={txStatus === "connecting"}
                  className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
                >
                  {txStatus === "connecting" ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Wallet className="w-4 h-4 mr-2" />
                      Connect MetaMask
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <>
                {/* Amount Input */}
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-white">
                    Amount (ETH)
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.0"
                    value={ethAmount}
                    onChange={(e) => setEthAmount(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-cyan-500"
                    step="0.001"
                    min="0"
                    disabled={currentStep !== "swap"}
                  />
                  {errors.ethAmount && (
                    <p className="text-red-400 text-sm flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.ethAmount}
                    </p>
                  )}
                </div>

                {/* Token Selection */}
                <div className="space-y-2">
                  <Label className="text-white">Token Pair</Label>
                  <Select value={selectedToken} onValueChange={setSelectedToken} disabled={currentStep !== "swap"}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="ETH-USDC">ETH → USDC</SelectItem>
                      <SelectItem value="ETH-USDT">ETH → USDT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Stellar Address */}
                <div className="space-y-2">
                  <Label htmlFor="stellar" className="text-white">
                    Recipient Stellar Address
                  </Label>
                  <Input
                    id="stellar"
                    placeholder="GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                    value={stellarAddress}
                    onChange={(e) => setStellarAddress(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500"
                    disabled={currentStep === "confirm"}
                  />
                  {errors.stellarAddress && (
                    <p className="text-red-400 text-sm flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.stellarAddress}
                    </p>
                  )}
                </div>

                {/* Memo Field */}
                <div className="space-y-2">
                  <Label htmlFor="memo" className="text-white">
                    Memo (Optional)
                  </Label>
                  <Textarea
                    id="memo"
                    placeholder="Add a note for this transaction..."
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-pink-500 resize-none"
                    rows={3}
                    disabled={currentStep === "confirm"}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Back Button */}
                  {(currentStep === "send" || currentStep === "confirm") &&
                    txStatus !== "sending" &&
                    txStatus !== "swapping" && (
                      <Button
                        onClick={goBack}
                        variant="outline"
                        className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white bg-transparent"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                      </Button>
                    )}

                  {/* Main Action Button */}
                  {currentStep === "swap" && (
                    <Button
                      onClick={handleSwap}
                      disabled={txStatus !== "idle"}
                      className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
                    >
                      {txStatus === "swapping" ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Swapping...
                        </>
                      ) : (
                        <>
                          Convert ETH → USDC
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  )}

                  {currentStep === "send" && (
                    <Button
                      onClick={handleSend}
                      disabled={txStatus !== "idle"}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white"
                    >
                      {txStatus === "sending" ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send to Stellar
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  )}

                  {currentStep === "confirm" && txStatus === "success" && (
                    <Button
                      onClick={resetTransaction}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      New Transaction
                    </Button>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Transaction Status Panel */}
        {isWalletConnected && (txStatus !== "idle" || currentStep !== "swap") && (
          <Card className="mt-6 bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                {txStatus === "success" ? (
                  <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                ) : txStatus === "error" ? (
                  <AlertCircle className="w-5 h-5 mr-2 text-red-400" />
                ) : txStatus !== "idle" ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin text-cyan-400" />
                ) : (
                  <Info className="w-5 h-5 mr-2 text-blue-400" />
                )}
                Transaction Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(txStatus === "swapping" || txStatus === "sending") && (
                  <Progress value={progress} className="h-2 bg-slate-700" />
                )}

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-slate-300">Wallet Connected</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {txStatus === "swapping" ? (
                      <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                    ) : currentStep !== "swap" ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-slate-600" />
                    )}
                    <span className="text-slate-300">Swapping ETH</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {currentStep === "confirm" && txStatus !== "sending" ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : txStatus === "sending" ? (
                      <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                    ) : currentStep === "send" ? (
                      <div className="w-4 h-4 rounded-full border-2 border-purple-400" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-slate-600" />
                    )}
                    <span className="text-slate-300">Received USDC</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {txStatus === "success" && currentStep === "confirm" ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : txStatus === "sending" ? (
                      <Loader2 className="w-4 h-4 animate-spin text-pink-400" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-slate-600" />
                    )}
                    <span className="text-slate-300">Sent to Stellar</span>
                  </div>
                </div>

                {txStatus === "success" && currentStep === "confirm" && (
                  <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-400 font-medium">Transaction Successful!</p>
                        <p className="text-slate-400 text-sm">{ethAmount} ETH converted and sent to Stellar</p>
                      </div>
                      <Button variant="ghost" size="sm" className="text-green-400 hover:text-green-300">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/50 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-6 text-sm text-slate-400">
              <a href="#" className="hover:text-cyan-400 transition-colors">
                About
              </a>
              <a href="#" className="hover:text-cyan-400 transition-colors flex items-center">
                <Github className="w-4 h-4 mr-1" />
                GitHub Repo
              </a>
            </div>
            <div className="flex items-center space-x-2 text-sm text-slate-400">
              <Info className="w-4 h-4" />
              <span>Built for 1inch Hackathon</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
