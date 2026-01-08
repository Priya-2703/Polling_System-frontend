import { useState } from "react";
import useSound from "use-sound";
import scifi from "../assets/scifi.wav";
import { Icon } from "@iconify/react";

const SettingsPage = () => {
  const [playClick] = useSound(scifi);
  const [activeTab, setActiveTab] = useState("general");

  const tabs = [
    { id: "general", label: "General", icon: "lucide:settings" },
    { id: "security", label: "Security", icon: "lucide:shield" },
    { id: "notifications", label: "Notifications", icon: "lucide:bell" },
    { id: "integrations", label: "Integrations", icon: "lucide:plug" },
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-1 h-6 bg-purple-400 rounded-full" />
          <h1 className="font-heading text-xl md:text-3xl text-white font-bold tracking-wide">
            Settings
          </h1>
        </div>
        <p className="text-white/40 text-xs md:text-sm font-heading pl-4">
          Configure system preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1">
          <div className="bg-black/40 backdrop-blur-xl border border-accet/10 rounded-sm p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  playClick();
                  setActiveTab(tab.id);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm transition-all
                  ${activeTab === tab.id 
                    ? 'bg-accet/20 text-accet border border-accet/30' 
                    : 'text-white/60 hover:bg-white/5 hover:text-white border border-transparent'
                  }`}
              >
                <Icon icon={tab.icon} width={18} />
                <span className="font-heading text-xs uppercase tracking-wider">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="bg-black/40 backdrop-blur-xl border border-accet/10 rounded-sm p-4 md:p-6">
            {activeTab === "general" && <GeneralSettings />}
            {activeTab === "security" && <SecuritySettings />}
            {activeTab === "notifications" && <NotificationSettings />}
            {activeTab === "integrations" && <IntegrationSettings />}
          </div>
        </div>
      </div>
    </div>
  );
};

const GeneralSettings = () => {
  const [playClick] = useSound(scifi);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-heading text-lg text-white font-semibold mb-1">General Settings</h3>
        <p className="text-white/40 text-xs">Basic configuration options</p>
      </div>

      <div className="space-y-4">
        {/* Poll Name */}
        <div>
          <label className="block text-white/60 text-xs font-heading uppercase tracking-wider mb-2">
            Poll Name
          </label>
          <input
            type="text"
            defaultValue="General Election 2024"
            className="w-full bg-white/5 border border-accet/20 rounded-sm px-4 py-3 
              text-white text-sm font-heading
              focus:outline-none focus:border-accet/50 focus:bg-accet/5 transition-all"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-white/60 text-xs font-heading uppercase tracking-wider mb-2">
            Description
          </label>
          <textarea
            rows={3}
            defaultValue="Annual general election for selecting the new leadership"
            className="w-full bg-white/5 border border-accet/20 rounded-sm px-4 py-3 
              text-white text-sm font-heading
              focus:outline-none focus:border-accet/50 focus:bg-accet/5 transition-all resize-none"
          />
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-white/60 text-xs font-heading uppercase tracking-wider mb-2">
              Start Date
            </label>
            <input
              type="datetime-local"
              className="w-full bg-white/5 border border-accet/20 rounded-sm px-4 py-3 
                text-white text-sm font-heading
                focus:outline-none focus:border-accet/50 transition-all"
            />
          </div>
          <div>
            <label className="block text-white/60 text-xs font-heading uppercase tracking-wider mb-2">
              End Date
            </label>
            <input
              type="datetime-local"
              className="w-full bg-white/5 border border-accet/20 rounded-sm px-4 py-3 
                text-white text-sm font-heading
                focus:outline-none focus:border-accet/50 transition-all"
            />
          </div>
        </div>

        {/* Toggle Options */}
        <div className="space-y-3 pt-4 border-t border-accet/10">
          {[
            { label: "Allow anonymous voting", enabled: false },
            { label: "Show real-time results", enabled: true },
            { label: "Enable voter verification", enabled: true },
            { label: "Multiple votes per user", enabled: false },
          ].map((option, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-sm">
              <span className="text-white/80 text-sm">{option.label}</span>
              <button
                onClick={() => playClick()}
                className={`relative w-12 h-6 rounded-full transition-all
                  ${option.enabled ? 'bg-accet' : 'bg-white/20'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all
                  ${option.enabled ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          onClick={() => playClick()}
          className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-sm 
            text-white/60 text-xs font-heading uppercase tracking-wider
            hover:bg-white/10 transition-all"
        >
          Cancel
        </button>
        <button
          onClick={() => playClick()}
          className="px-6 py-2.5 bg-accet/20 border border-accet/50 rounded-sm 
            text-accet text-xs font-heading uppercase tracking-wider
            hover:bg-accet/30 transition-all flex items-center gap-2"
        >
          <Icon icon="lucide:save" width={14} />
          Save Changes
        </button>
      </div>
    </div>
  );
};

const SecuritySettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-heading text-lg text-white font-semibold mb-1">Security Settings</h3>
        <p className="text-white/40 text-xs">Manage security and access control</p>
      </div>

      <div className="grid gap-4">
        {[
          { icon: "lucide:fingerprint", label: "Two-Factor Authentication", desc: "Require 2FA for admin access", enabled: true },
          { icon: "lucide:shield-check", label: "Vote Encryption", desc: "Encrypt all votes with AES-256", enabled: true },
          { icon: "lucide:lock", label: "Session Timeout", desc: "Auto logout after 30 minutes", enabled: true },
          { icon: "lucide:eye-off", label: "Anonymous Mode", desc: "Hide voter identities", enabled: false },
        ].map((item, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-sm">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-sm bg-indigo-500/20 flex items-center justify-center">
                <Icon icon={item.icon} className="text-indigo-400" width={20} />
              </div>
              <div>
                <p className="text-white text-sm font-heading">{item.label}</p>
                <p className="text-white/40 text-xs">{item.desc}</p>
              </div>
            </div>
            <div className={`w-12 h-6 rounded-full ${item.enabled ? 'bg-accet' : 'bg-white/20'} relative cursor-pointer`}>
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all
                ${item.enabled ? 'left-7' : 'left-1'}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const NotificationSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-heading text-lg text-white font-semibold mb-1">Notification Settings</h3>
        <p className="text-white/40 text-xs">Configure alerts and notifications</p>
      </div>

      <div className="space-y-4">
        {[
          { label: "Email notifications", desc: "Receive updates via email" },
          { label: "Vote alerts", desc: "Alert when new votes come in" },
          { label: "Milestone alerts", desc: "Notify at vote milestones" },
          { label: "Security alerts", desc: "Suspicious activity alerts" },
        ].map((item, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-sm">
            <div>
              <p className="text-white text-sm">{item.label}</p>
              <p className="text-white/40 text-xs">{item.desc}</p>
            </div>
            <input type="checkbox" defaultChecked={index < 2} className="w-5 h-5 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
};

const IntegrationSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-heading text-lg text-white font-semibold mb-1">Integrations</h3>
        <p className="text-white/40 text-xs">Connect external services</p>
      </div>

      <div className="grid gap-4">
        {[
          { name: "Blockchain", desc: "Vote verification", connected: true, icon: "lucide:link" },
          { name: "Analytics", desc: "Advanced reporting", connected: true, icon: "lucide:bar-chart" },
          { name: "SMS Gateway", desc: "Voter notifications", connected: false, icon: "lucide:message-square" },
        ].map((item, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-sm bg-cyan-500/20 flex items-center justify-center">
                <Icon icon={item.icon} className="text-cyan-400" width={24} />
              </div>
              <div>
                <p className="text-white text-sm font-heading">{item.name}</p>
                <p className="text-white/40 text-xs">{item.desc}</p>
              </div>
            </div>
            <button className={`px-4 py-2 rounded-sm text-xs font-heading uppercase tracking-wider transition-all
              ${item.connected 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                : 'bg-white/10 text-white/60 border border-white/20 hover:bg-accet/20 hover:text-accet hover:border-accet/30'
              }`}>
              {item.connected ? 'Connected' : 'Connect'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SettingsPage;