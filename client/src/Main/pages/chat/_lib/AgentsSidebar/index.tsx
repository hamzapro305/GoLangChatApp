import { FC, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { IoClose, IoDocumentText, IoCheckmarkCircle } from "react-icons/io5";
import { RiRobot2Fill, RiBrainFill } from "react-icons/ri";
import { FaStickyNote } from "react-icons/fa";
import axios from "axios";
import "./style.scss";

type Agent = {
    name: string;
    description: string;
    detailedDescription: string;
    icon: string;
    color: string;
    gradient: string;
};

type Props = {
    isOpen: boolean;
    onClose: () => void;
    conversationId: string;
};

// Constant agents - no API fetch needed
const AGENTS: Agent[] = [
    {
        name: "psychological_insights",
        description: "Deep Psychological Analysis",
        detailedDescription: "Analyze conversation patterns to extract psychological insights, emotional states, thinking patterns, diagnoses, strengths, and areas of growth",
        icon: "brain",
        color: "purple",
        gradient: "from-purple-600 to-pink-600"
    },
    {
        name: "notes_creator",
        description: "Structured Note Generation",
        detailedDescription: "Extract structured notes including summary, key points, action items, decisions made, and participant insights from your conversation",
        icon: "notes",
        color: "blue",
        gradient: "from-blue-600 to-cyan-600"
    }
];

const AgentsSidebar: FC<Props> = ({ isOpen, onClose, conversationId }) => {
    const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            setResult(null);
            setError(null);
            setSelectedAgent(null);
        }
    }, [isOpen]);

    const handleAgentClick = async (agentName: string) => {
        if (processing) return;

        setSelectedAgent(agentName);
        setProcessing(true);
        setResult(null);
        setError(null);

        try {
            if (agentName === "psychological_insights") {
                // Call psychological insights agent
                const res = await axios.post(
                    `http://${window.location.hostname}:8000/api/v1/agents/psychological_insights/analyze`,
                    { conversation_id: conversationId },
                    { headers: { "Content-Type": "application/json" } }
                );

                if (res.data.error) {
                    setError(res.data.error);
                } else {
                    setResult(res.data);
                }
            } else if (agentName === "notes_creator") {
                // Call notes creator agent with conversation_id
                const res = await axios.post(
                    `http://${window.location.hostname}:8000/api/v1/agents/notes_creator/analyze`,
                    { conversation_id: conversationId },
                    { headers: { "Content-Type": "application/json" } }
                );

                if (res.data.error) {
                    setError(res.data.error);
                } else {
                    setResult(res.data);
                }
            }
        } catch (error: any) {
            console.error("Agent processing failed:", error);
            setError(error.response?.data?.detail || error.response?.data?.message || "Failed to process. Please try again.");
        } finally {
            setProcessing(false);
        }
    };

    const getAgentIcon = (agent: Agent) => {
        if (agent.icon === "brain") {
            return <RiBrainFill size={32} />;
        }
        return <FaStickyNote size={28} />;
    };

    const getAgentColor = (agent: Agent) => {
        return agent.gradient;
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="agents-sidebar-container"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <motion.div
                        className="agents-sidebar"
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    >
                        {/* Header */}
                        <div className="sidebar-header">
                            <div className="header-content">
                                <div className="header-icon">
                                    <RiRobot2Fill size={28} />
                                </div>
                                <div className="header-text">
                                    <h2>AI Agents</h2>
                                    <p>Choose an agent to analyze your conversation</p>
                                </div>
                            </div>
                            <button className="close-btn" onClick={onClose}>
                                <IoClose size={24} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="sidebar-content">
                            <div className="agents-grid">
                                {AGENTS.map((agent) => {
                                    const displayName = agent.name.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
                                    const isSelected = selectedAgent === agent.name;

                                    return (
                                        <motion.div
                                            key={agent.name}
                                            className={`agent-card ${isSelected ? "selected" : ""} ${agent.color}`}
                                            onClick={() => handleAgentClick(agent.name)}
                                            whileHover={{ scale: 1.02, y: -4 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <div className={`agent-icon-wrapper bg-gradient-to-br ${agent.gradient}`}>
                                                {getAgentIcon(agent)}
                                            </div>
                                            <div className="agent-details">
                                                <h3>{displayName}</h3>
                                                <p className="short-desc">{agent.description}</p>
                                                <p className="detailed-desc">{agent.detailedDescription}</p>
                                            </div>
                                            {isSelected && (
                                                <motion.div
                                                    className="selected-badge"
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                >
                                                    <IoCheckmarkCircle />
                                                </motion.div>
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {processing && (
                                <motion.div
                                    className="processing-state"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <div className="spinner-large"></div>
                                    <h3>Processing with AI...</h3>
                                    <p>Analyzing your conversation, please wait...</p>
                                </motion.div>
                            )}

                            {error && !processing && (
                                <motion.div
                                    className="error-state"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <div className="error-icon">⚠️</div>
                                    <h3>Processing Failed</h3>
                                    <p>{error}</p>
                                </motion.div>
                            )}

                            {result && !processing && !error && selectedAgent === "psychological_insights" && (
                                <PsychologicalInsightsResult result={result} />
                            )}

                            {result && !processing && !error && selectedAgent === "notes_creator" && (
                                <NotesCreatorResult result={result} />
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const PsychologicalInsightsResult: FC<{ result: any }> = ({ result }) => (
    <motion.div
        className="results-container psychological"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
    >
        <div className="results-header">
            <RiBrainFill size={24} />
            <h3>Psychological Analysis</h3>
        </div>

        {result.summary && (
            <div className="result-card summary">
                <h4>Summary</h4>
                <p>{result.summary}</p>
            </div>
        )}

        {result.emotional_patterns && result.emotional_patterns.length > 0 && (
            <div className="result-card">
                <h4>🎭 Emotional Patterns</h4>
                <ul>
                    {result.emotional_patterns.map((pattern: string, i: number) => (
                        <li key={i}>{pattern}</li>
                    ))}
                </ul>
            </div>
        )}

        {result.thinking_patterns && result.thinking_patterns.length > 0 && (
            <div className="result-card">
                <h4>🧠 Thinking Patterns</h4>
                <ul>
                    {result.thinking_patterns.map((pattern: string, i: number) => (
                        <li key={i}>{pattern}</li>
                    ))}
                </ul>
            </div>
        )}

        {result.diagnoses && result.diagnoses.length > 0 && (
            <div className="result-card diagnoses">
                <h4>🔬 Psychological Diagnoses</h4>
                <ul>
                    {result.diagnoses.map((diagnosis: string, i: number) => (
                        <li key={i}>{diagnosis}</li>
                    ))}
                </ul>
            </div>
        )}

        {result.strengths && result.strengths.length > 0 && (
            <div className="result-card strengths">
                <h4>💪 Strengths</h4>
                <ul>
                    {result.strengths.map((strength: string, i: number) => (
                        <li key={i}>{strength}</li>
                    ))}
                </ul>
            </div>
        )}

        {result.areas_of_growth && result.areas_of_growth.length > 0 && (
            <div className="result-card">
                <h4>🌱 Areas of Growth</h4>
                <ul>
                    {result.areas_of_growth.map((area: string, i: number) => (
                        <li key={i}>{area}</li>
                    ))}
                </ul>
            </div>
        )}

        {result.confidence_level && (
            <div className="confidence-indicator">
                <span>Confidence Level:</span>
                <div className={`badge ${result.confidence_level}`}>
                    {result.confidence_level}
                </div>
            </div>
        )}
    </motion.div>
);

const NotesCreatorResult: FC<{ result: any }> = ({ result }) => (
    <motion.div
        className="results-container notes"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
    >
        <div className="results-header">
            <FaStickyNote size={24} />
            <h3>Conversation Notes</h3>
        </div>

        {result.summary && (
            <div className="result-card summary">
                <h4>📝 Summary</h4>
                <p>{result.summary}</p>
            </div>
        )}

        {result.key_points && result.key_points.length > 0 && (
            <div className="result-card">
                <h4>🔑 Key Points</h4>
                <ul>
                    {result.key_points.map((point: string, i: number) => (
                        <li key={i}>{point}</li>
                    ))}
                </ul>
            </div>
        )}

        {result.action_items && result.action_items.length > 0 && (
            <div className="result-card actions">
                <h4>✅ Action Items</h4>
                <ul>
                    {result.action_items.map((item: string, i: number) => (
                        <li key={i}>{item}</li>
                    ))}
                </ul>
            </div>
        )}

        {result.decisions && result.decisions.length > 0 && (
            <div className="result-card">
                <h4>🎯 Decisions Made</h4>
                <ul>
                    {result.decisions.map((decision: string, i: number) => (
                        <li key={i}>{decision}</li>
                    ))}
                </ul>
            </div>
        )}

        {result.participants && result.participants.length > 0 && (
            <div className="result-card">
                <h4>👥 Participants</h4>
                <div className="participants-list">
                    {result.participants.map((participant: string, i: number) => (
                        <span key={i} className="participant-badge">{participant}</span>
                    ))}
                </div>
            </div>
        )}
    </motion.div>
);

export default AgentsSidebar;
