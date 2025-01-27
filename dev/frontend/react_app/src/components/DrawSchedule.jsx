export const DrawSchedule = ({ data }) => {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "flex-start",
          width: "25vw", // 画面幅の1/4
          height: "70vh", // 画面高さの1/4
          padding: "10px",
          overflowY: "auto", // 内容が溢れる場合スクロール可能
          position: "absolute",
          top: "10vh", // 画面下部
          right: "1vw", // 画面右端
          backgroundColor: "#f4f4f4", // 背景色
          border: "1px solid #ccc", // 境界線
          borderRadius: "8px", // 角丸
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // 影
        }}
      >
        <div style={{ width: "100%" }}>
          <h1
            style={{
              color: "#333",
              fontSize: "18px", // 見出しの文字サイズを小さく調整
              marginBottom: "10px",
            }}
          >
            Task Schedule
          </h1>
          {data.TaskList.map((task, index) => (
            <div
              key={index}
              style={{
                backgroundColor: "#fff",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                marginBottom: "10px",
                padding: "10px",
                textAlign: "left",
              }}
            >
              <h2 style={{ color: "#007BFF", fontSize: "16px" }}>{task.name}</h2>
              <p style={{ fontSize: "14px", color: "#555" }}>{task.description}</p>
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  color: "#333",
                  marginTop: "5px",
                }}
              >
                Time: <span style={{ color: "#e74c3c" }}>{task.metadata.time} seconds</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };
  