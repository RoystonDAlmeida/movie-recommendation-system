function ResultsCount({ numResults }) {
    return (
      <div className="text-slate-300">
        {numResults} {numResults === 1 ? 'result' : 'results'} found
      </div>
    );
  }
  
export default ResultsCount;  