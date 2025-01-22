import "./style.scss";
import Sidebar from "./_lib/Sidebar";

const MainChat = () => {
    return (
        <div className="chat-page">
            <div className="chat-page-header">
                <div className="logo">Logo</div>
                <nav>
                    <ul>
                        <li>Inbox</li>
                        <li>Test</li>
                    </ul>
                </nav>
                <div className="user-profile">
                    <div className="pp">
                        <img
                            src="https://www.shutterstock.com/image-vector/image-icon-600nw-211642900.jpg"
                            alt=""
                        />
                    </div>
                    <div className="name">Hamza</div>
                </div>
            </div>
            <div className="chat-page-body">
                <Sidebar />
                <div className="chat"></div>
            </div>
        </div>
    );
};

export default MainChat;
