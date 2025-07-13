import Link from 'next/link';
import { queryIgdb, getCoverUrl } from '../lib/igdb';

export default async function SearchPage({ searchParams }) {
  const query = searchParams.q || '';
  let games = [];
  let error = null;

  if (query) {
    try {

      const queryBody = `
        search "${query}";
        fields name, cover.image_id, slug, total_rating;
        where cover != null;
        limit 50;
      `;
      games = await queryIgdb('games', queryBody);
    } catch (err) {
      console.error(err);
      error = err.message;
    }
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 border-b border-gray-700 pb-2">
        Search Results for "{query}"
      </h2>

      {error && <p className="text-red-500">Error fetching results: {error}</p>}
      
      {!query && <p>Please enter a search term to find games.</p>}
      
      {query && games.length === 0 && !error && (
        <p>No games found for "{query}". Try another search.</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {games.map((game) => (
          <div key={game.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-purple-500/20 transition-shadow duration-300">
            <Link href={`/games/${game.slug || game.id}`}>
                <img
                  src={getCoverUrl(game.cover?.image_id, 'cover_big')}
                  alt={`Cover for ${game.name}`}
                  className="w-full h-auto object-cover"
                  width="264"
                  height="352"
                />
            </Link>
            <div className="p-4">
              <Link href={`/games/${game.slug || game.id}`} className="hover:text-purple-400">
                <h3 className="font-bold text-md truncate">{game.name}</h3>
              </Link>
               {game.total_rating && (
                 <p className="text-sm text-gray-400 mt-1">
                    Rating: {Math.round(game.total_rating)}%
                 </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
