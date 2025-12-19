import React from "react";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import AgentsCarousel from "@/components/AgentsCarousel";
import PartnersCarousel from "@/components/PartnersCarousel";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import { addToast } from "@heroui/toast";
import { useTranslation } from "react-i18next";
const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <>
      <>
        <div className="h-screen w-full">
          <div className="h-screen w-full overflow-hidden absolute top-0 left-0 -z-10">
            <div className="bg-black/50 h-screen w-full absolute top-0 left-0" />
            <video width="100%" height="100%" autoPlay loop muted>
              <source src="/img/home-mv.mp4" type="video/mp4" />
            </video>
          </div>
          <div className="flex flex-col items-center justify-center h-screen">
            <img className="w-[200px]" src="/img/logo.png" alt="logo" />
            <div className="font-w-mianfeiziti text-7xl text-center text-default font-bold italic leading-[1.2] mt-6">
              On-Chain AI Agent Twin for Everyone:
              <br />
              Train & Earn
            </div>
            <div className="text-sm text-center text-[#C4C4C4] mt-4 max-w-8/12 px-4">
              Open & Interoperable Ecosystem | Trainable & Evolving Agent |
              On-Chain Tokenized Ownership
            </div>
            <Button
              color="default"
              className="font-w-mianfeiziti px-6 py-3 rounded-md mt-8 cursor-pointer"
              onPress={() =>
                navigate("/agent")
              }
            >
              Launch Dapp
            </Button>
          </div>
        </div>

        <div className="overflow-hidden section">
          <div className="container mx-auto space-y-6 mt-20 mb-10">
            <div className="text-2xl text-default font-w-mianfeiziti">
              What is Floa？
            </div>
            <div className="flex w-full bg-linear-to-r from-[#CC9100] to-[#C2590C] rounded-xl relative">
              <div className="flex flex-col justify-center py-20 pl-10 max-w-[50%]">
                <div className="text-sm text-[#fff] space-y-4">
                  <p>
                    Floa is an open intelligent Agent ecosystem that empowers
                    every user to own a cross-platform intelligent collaboration
                    partner—mintable, trainable, verifiable, and tradable.
                  </p>

                  <p>
                    No coding or professional skills required: through daily
                    interactive training (conversational collaboration, task
                    execution), your Agent can handle digital tasks on your
                    behalf (asset management, scenario-based service
                    integration) while you earn ecosystem rewards.
                  </p>
                  <p>Step into the intelligent Agent era effortlessly.</p>
                </div>
                <Button
                  color="default"
                  className="font-w-mianfeiziti px-6 py-3 rounded-md mt-20 cursor-pointer max-w-[200px]"
                >
                  View Gitbook
                </Button>
              </div>
              <img
                src="/img/home-629.png"
                alt="629"
                className="absolute bottom-0 right-0 max-w-[44%]"
              />
            </div>
          </div>
          <AgentsCarousel />
          <Divider className="container mx-auto mt-10" />
        </div>

        <div className="overflow-hidden section">
          <div className="container mx-auto space-y-6 my-10">
            <div className="text-2xl text-default font-w-mianfeiziti">
              Why Choose Floa？
            </div>

            <div className="grid grid-cols-2 justify-between gap-8">
              <div className="flex bg-linear-to-b from-[#CC8F00] to-[#824101] rounded-xl relative">
                <div className="flex flex-col gap-4 justify-between p-10 max-w-1/2 h-[300px]">
                  <div className="text-lg font-w-mianfeiziti">
                    Full Ownership & Control
                  </div>
                  <div className="text-sm text-[#C4C4C4]">
                    Agent training data is verified on-chain—you hold 100%
                    ownership. Supported by NFT-backed confirmation and
                    transfer, there’s no centralized control or data
                    exploitation.
                  </div>
                  <Button
                    color="default"
                    className="font-w-mianfeiziti px-6 py-3 rounded-md cursor-pointer max-w-[200px]"
                    onPress={() => navigate("/agent")}
                  >
                    Check
                  </Button>
                </div>
                <img
                  src="/img/home-992.png"
                  alt="992"
                  className="absolute bottom-0 right-[-15px]"
                />
              </div>
              <div className="flex bg-linear-to-b from-[#CC8F00] to-[#824101] rounded-xl relative">
                <div className="flex flex-col gap-4 justify-between p-10 max-w-1/2 h-[300px]">
                  <div className="text-lg font-w-mianfeiziti">
                    Flexible & Diversified
                  </div>
                  <div className="text-sm text-[#C4C4C4]">
                    EarningsHigher Agent levels = higher mining efficiency. Cash
                    out instantly on DEX.
                  </div>
                  <Button
                    color="default"
                    className="font-w-mianfeiziti px-6 py-3 rounded-md cursor-pointer max-w-[200px]"
                    onPress={() => navigate("/agent")}
                  >
                    Check
                  </Button>
                </div>
                <img
                  src="/img/home-991.png"
                  alt="991"
                  className="absolute bottom-0 right-[-30px] max-h-[110%]"
                />
              </div>
              <div className="flex bg-linear-to-b from-[#CC8F00] to-[#824101] rounded-xl relative">
                <div className="flex flex-col gap-4 justify-between p-10 max-w-1/2 h-[300px]">
                  <div className="text-lg font-w-mianfeiziti">
                    Cross-Scenario Collaboration
                  </div>
                  <div className="text-sm text-[#C4C4C4]">
                    Acting as a cross-application hub, your Agent connects
                    multi-domain service scenarios—handle digital tasks in one
                    stop, no need to switch tools repeatedly.
                  </div>
                  <Button
                    color="default"
                    className="font-w-mianfeiziti px-6 py-3 rounded-md cursor-pointer max-w-[200px]"
                    onPress={() => navigate("/agent")}
                  >
                    Check
                  </Button>
                </div>
                <img
                  src="/img/home-945.png"
                  alt="945"
                  className="absolute bottom-0 right-0 max-h-[110%]"
                />
              </div>
              <div className="flex bg-linear-to-b from-[#CC8F00] to-[#824101] rounded-xl relative">
                <div className="flex flex-col gap-4 justify-between p-10 max-w-2/3 h-[300px]">
                  <div className="text-lg font-w-mianfeiziti">
                    Long-Term Value Accumulation
                  </div>
                  <div className="text-sm text-[#C4C4C4]">
                    90% of training ticket revenue is auto-burned. High-level
                    Agents can undertake real-world commercial tasks (customer
                    service/content creation) and benefit from ecosystem growth.
                  </div>
                  <Button
                    color="default"
                    className="font-w-mianfeiziti px-6 py-3 rounded-md cursor-pointer max-w-[200px]"
                    onPress={() => navigate("/agent")}
                  >
                    Check
                  </Button>
                </div>
                <img
                  src="/img/home-947.png"
                  alt="947"
                  className="absolute bottom-0 right-0 max-h-[110%]"
                />
              </div>
            </div>
          </div>
          <Divider className="container mx-auto mt-10" />
        </div>

        <div className="overflow-hidden section">
          <div className="container mx-auto space-y-6 my-10">
            <div className="text-2xl text-default font-w-mianfeiziti">
              3 Steps to Your Intelligent Agent
            </div>
            <div className="flex justify-end items-center relative bg-[url('/img/home-7768.png')] bg-no-repeat bg-center bg-cover rounded-xl">
              <img
                src="/img/home-946.png"
                alt="946"
                className="absolute bottom-0 left-[-40px] max-h-[100%]"
              />
              <div className="w-[40%] py-40 pr-20 flex flex-col items-center justify-center gap-6">
                <div className="space-y-2">
                  <div className="text-lg font-w-mianfeiziti">
                    Create Your Agent
                  </div>
                  <div className="text-sm text-[#C4C4C4]">
                    Connect a compatible wallet to mint a Lv.1 Agent with a
                    small amount of FLOA, or complete social tasks to unlock a
                    Lv.2 Agent for free—customize your initial avatar.
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-lg font-w-mianfeiziti">
                    Train & Earn
                  </div>
                  <div className="text-sm text-[#C4C4C4]">
                    Purchase a training ticket and finish lightweight
                    interactive training. Earn FLOA rewards once triggered
                    successfully—the higher the level, the richer the rewards.
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-lg font-w-mianfeiziti">
                    Upgrade & Grow
                  </div>
                  <div className="text-sm text-[#C4C4C4]">
                    Accumulate training sessions + spend FLOA to level up your
                    Agent. Unlock more function slots and commercial perks as
                    your Agent’s NFT appreciates in value, with free trading
                    supported.
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Divider className="container mx-auto mt-10" />
        </div>

        <div className="overflow-hidden section">
          <div className="container mx-auto space-y-6 my-10">
            <div className="text-2xl text-default font-w-mianfeiziti">
              Agent Action Demonstration and Interactive Experience
            </div>
            <div className="flex justify-between gap-6">
              <div className="w-1/3 rounded-xl overflow-hidden">
                <video width="100%" height="100%" autoPlay loop muted>
                  <source src="/img/home-agent.mp4" type="video/mp4" />
                </video>
              </div>

              <div className="w-2/3 bg-linear-to-b from-[#CC9000] to-[#C25A0C] rounded-xl">
                <div className="flex flex-col w-full h-full justify-between items-center">
                  <img className="w-[40%]" src="/img/agent-transparency/32.png" alt="" />
                  <div className="w-full bg-[#3C2800] rounded-xl flex-1 flex items-center justify-center">
                    <Button
                      color="default"
                      className="font-w-mianfeiziti px-6 py-3 rounded-md cursor-pointer max-w-[200px]"
                      onPress={() => navigate("/agent")}
                    >
                      Start Experience
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Divider className="container mx-auto mt-10" />
        </div>

        <div className="overflow-hidden section">
          <div className="container mx-auto space-y-6 my-10">
            <div className="text-2xl text-default font-w-mianfeiziti mb-40">
              3 Core Technical Highlights
            </div>

            <div className="flex items-center justify-between gap-6">
              <div className="w-1/3 bg-linear-to-b from-[#CC9000] to-[#C25A0C] rounded-xl relative">
                <img
                  className="absolute bottom-0 left-0 right-0 mx-auto w-[80%]"
                  src="/img/home-935.png"
                  alt=""
                />
                <div className="relative z-1 px-10 pb-10 pt-60 mx-auto text-center bg-linear-to-b from-transparent to-black/90 space-y-6 ">
                  <div className="text-lg font-w-mianfeiziti">
                    Open Modular Architecture
                  </div>
                  <div className="text-sm text-[#C4C4C4]">
                    Five-layer distributed architecture supports cross-platform
                    (Web/mobile) and multi-domain API integration. Developers
                    integrate quickly via standardized APIs to expand scenarios.
                  </div>
                </div>
              </div>
              <div className="w-1/3 bg-linear-to-b from-[#CC9000] to-[#C25A0C] rounded-xl relative">
                <img
                  className="absolute bottom-0 left-0 right-0 mx-auto w-[80%]"
                  src="/img/home-933.png"
                  alt=""
                />
                <div className="relative z-1 px-10 pb-10 pt-60 mx-auto text-center bg-linear-to-b from-transparent to-black/90 space-y-6 ">
                  <div className="text-lg font-w-mianfeiziti">
                    Intelligent Training & Evolution Engine
                  </div>
                  <div className="text-sm text-[#C4C4C4]">
                    Compatible with mainstream LLMs (Llama/GPT, etc.).
                    Reinforcement learning enables Agents to optimize
                    decision-making/personalization via daily interactions;
                    training data fully encrypted.
                  </div>
                </div>
              </div>
              <div className="w-1/3 bg-linear-to-b from-[#CC9000] to-[#C25A0C] rounded-xl relative">
                <img
                  className="absolute bottom-0 left-0 right-0 mx-auto w-[80%]"
                  src="/img/home-932.png"
                  alt=""
                />
                <div className="relative z-1 px-10 pb-10 pt-60 mx-auto text-center bg-linear-to-b from-transparent to-black/90 space-y-6 ">
                  <div className="text-lg font-w-mianfeiziti">
                    On-Chain Verification & Security Mechanism
                  </div>
                  <div className="text-sm text-[#C4C4C4]">
                    Core ownership data on-chain; Agent-NFT one-to-one mapping
                    confirms assets. Distributed storage + hierarchical
                    encryption balances privacy and traceability, preventing
                    centralized data exploitation.
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Divider className="container mx-auto mt-10" />
        </div>
        <div className="overflow-hidden section">
          <div className="container mx-auto space-y-6 my-10">
            <div className="text-2xl text-default font-w-mianfeiziti">
              Transparent & Sustainable Tokenomics
            </div>
            <div className="bg-linear-to-r from-[#763500] to-[#CC9100] rounded-xl flex items-center justify-between px-10">
              <div className="w-2/5 space-y-6">
                <div className="space-y-2">
                  <div className="text-lg font-w-mianfeiziti">
                    Total Supply
                  </div>
                  <div className="text-sm text-[#C4C4C4]">
                    <p>·100,000,000 FLOA.</p>
                    <p>·Permanently fixed, no additional issuance.</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-lg font-w-mianfeiziti">
                    Distribution
                  </div>
                  <div className="text-sm text-[#C4C4C4]">
                    <p>·Train to Earn: 92%.</p>
                    <p>·Public Sale.</p>
                    <p>·Liquidity Pools: 3%.</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-lg font-w-mianfeiziti">
                    Deflation Mechanism
                  </div>
                  <div className="text-sm text-[#C4C4C4]">
                    <p>
                      ·90% of training ticket revenue is auto-burned by smart
                      contracts, continuously reducing circulating supply and
                      enhancing long-term value.
                    </p>
                  </div>
                </div>
                <Button
                  color="default"
                  className="font-w-mianfeiziti px-6 py-3 rounded-md cursor-pointer max-w-[200px]"
                  onPress={() =>
                    addToast({
                      title: t("shoppingMall.comingSoon"),
                      description: t("shoppingMall.comingSoonDesc"),
                      color: "primary",
                    })
                  }
                >
                  Purchase Tokens
                </Button>
              </div>
              <div className="relative">
                <img
                  className="w-[90%] mx-auto animate-spin-slow"
                  src="/img/home-1668.png"
                  alt=""
                />
                <img
                  className="absolute top-0 bottom-0 left-0 right-0 m-auto"
                  src="/img/home-1769.png"
                  alt=""
                />
              </div>
            </div>
          </div>

          <Divider className="container mx-auto mt-10" />
        </div>

        <div className="overflow-hidden section">
          <div className="container mx-auto space-y-6 my-10">
            <div className="text-2xl text-default font-w-mianfeiziti">
              Floa Ecosystem Roadmap
            </div>
            <div className="flex gap-6">
              <div className="flex-1 bg-linear-to-b from-[#CA890160] to-[#97450560] rounded-xl p-10">
                <div className="text-lg font-w-mianfeiziti">
                  Phase 1:
                  <br />
                  Foundation (0-6 Months)
                </div>
                <div className="mt-6 space-y-2 text-sm text-[#D1B17D]">
                  <p>·Multi-platform DApp Launch.</p>
                  <p>·Initial Liquidity Injection.</p>
                  <p>·Launch of Lv.1-6 Agent Training.</p>
                  <p>·Onboard 1M+ Users.</p>
                </div>
              </div>
              <div className="flex-1 bg-linear-to-b from-[#CA890160] to-[#97450560] rounded-xl p-10">
                <div className="text-lg font-w-mianfeiziti">
                  Phase 2:
                  <br />
                  Collaboration (6-18 Months)
                </div>
                <div className="mt-6 space-y-2 text-sm text-[#D1B17D]">
                  <p>·Open Agent Development APIs.</p>
                  <p>·Integrate Multi-domain Vertical Apps.</p>
                  <p>·Launch Agent Collaboration Missions.</p>
                  <p>·Kick Off Developer Incentive Program.</p>
                </div>
              </div>
              <div className="flex-1 bg-linear-to-b from-[#CA890160] to-[#97450560] rounded-xl p-10">
                <div className="text-lg font-w-mianfeiziti">
                  Phase 3:
                  <br />
                  Commercialization (18+ Months)
                </div>
                <div className="mt-6 space-y-2 text-sm text-[#D1B17D]">
                  <p>·Launch DAO Governance</p>
                  <p>
                    ·Roll Out Agent Commercial Service Platform (for real- world
                    scenarios).
                  </p>
                  <p>·Achieve Full Ecosystem Open Collaboration.</p>
                  <p>·Commercial Closed-Loop.</p>
                </div>
              </div>
              <div className="flex-1 bg-linear-to-b from-[#CA890160] to-[#97450560] rounded-xl p-10">
                <div className="text-lg font-w-mianfeiziti">
                  Phase 4:
                  <br />
                  Global Synergy & Evolution (36+ Months)
                </div>
                <div className="mt-6 space-y-2 text-sm text-[#D1B17D]">
                  <p>
                    ·Build a Global Boundless Intelligent Agent Collaboration
                    Network with seamless cross-chain/platform integration.
                  </p>
                  <p>
                    ·Agents achieve autonomous evolution/scenario innovation,
                    scaling to 100M+ users.
                  </p>
                  <p>
                    ·Set decentralized global digital service standards,
                    becoming the core hub linking digital and real
                    worlds—integrating Agents into daily life.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Divider className="container mx-auto mt-10" />
        </div>

        <div className="overflow-hidden section">
          <div className="container mx-auto space-y-6 my-10">
            <div className="text-2xl text-default font-w-mianfeiziti">
              Ecological Support
            </div>
          </div>
          <div className="bg-[#1e1104] py-10">
            <PartnersCarousel />
          </div>
        </div>

        <div className="overflow-hidden section mt-10 bg-linear-to-b from-[#603800] to-[#1e1104]">
          <Footer />
        </div>
      </>
    </>
  );
};
export default HomePage;
