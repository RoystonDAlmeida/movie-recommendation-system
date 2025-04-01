import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '../ui/select';
  
  function FilterBar({
    selectedLanguage,
    setSelectedLanguage,
    selectedType,
    setSelectedType,
    selectedGenre,
    setSelectedGenre,
    availableLanguages,
    availableTypes,
    availableGenres,
  }) {
    return (
      <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 justify-center items-center">
        <div className="flex space-x-4">
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="w-48 bg-slate-800 border-slate-700">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              {availableLanguages.map((lang) => (
                <SelectItem key={lang} value={lang}>
                  {lang === 'all' ? 'All Languages' : lang}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
  
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-48 bg-slate-800 border-slate-700">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              {availableTypes.map((t) => (
                <SelectItem key={t} value={t}>
                  {t === 'all' ? 'All Types' : t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
  
          <Select value={selectedGenre} onValueChange={setSelectedGenre}>
            <SelectTrigger className="w-48 bg-slate-800 border-slate-700">
              <SelectValue placeholder="Genre" />
            </SelectTrigger>
            <SelectContent>
              {availableGenres.map((g) => (
                <SelectItem key={g} value={g}>
                  {g === 'all' ? 'All Genres' : g}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  }
  
export default FilterBar;  