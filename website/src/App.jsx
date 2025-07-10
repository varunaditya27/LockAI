import React from "react";
import Sidebar from "./components/Sidebar";
import HeroSection from "./components/HeroSection";
import HardwareSection from "./components/HardwareSection";
import RemoteControlSection from "./components/RemoteControlSection";
import SmartBehaviorSection from "./components/SmartBehaviorSection";
import FeaturesSection from "./components/FeaturesSection";
import SoftwareSection from "./components/SoftwareSection";
import UserFlowSection from "./components/UserFlowSection";
import WorkflowSection from "./components/WorkflowSection";
import BlynkSetupSection from "./components/BlynkSetupSection";
import FutureSection from "./components/FutureSection";
import ContributorsSection from "./components/ContributorsSection";
import Footer from "./components/Footer";
import "./App.css";

export default function App() {
  return (
    <div className="app-root">
      <div className="animated-bg" aria-hidden="true" />
      <Sidebar />
      <main className="main-content">
        <HeroSection id="hero" />
        <HardwareSection id="hardware" />
        <RemoteControlSection id="remote" />
        <SmartBehaviorSection id="smartbehavior" />
        <FeaturesSection id="features" />
        <SoftwareSection id="software" />
        <UserFlowSection id="userflow" />
        <WorkflowSection id="workflow" />
        <BlynkSetupSection id="blynk" />
        <FutureSection id="future" />
        <ContributorsSection id="contributors" />
      <Footer />
      </main>
      </div>
  );
}
