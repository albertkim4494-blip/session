export function ExerciseGif({ gifUrl, exerciseName, colors }) {
  if (!gifUrl) return null;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <img
        src={gifUrl}
        alt={`${exerciseName} demonstration`}
        style={{
          maxWidth: 200,
          maxHeight: 200,
          display: "block",
          mixBlendMode: "multiply",
        }}
        loading="lazy"
      />
    </div>
  );
}
