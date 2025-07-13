import { queryIgdb, getCoverUrl } from '../../lib/igdb';
import Link from 'next/link';

export default async function GameDetailPage({ params }) {
  let game = null;
  let error = null;

  try {
    const queryBody = `
      fields 
        name, 
        summary, 
        first_release_date,
        cover.image_id, 
        screenshots.image_id,
        genres.name,
        platforms.name,
        involved_companies.company.name,
        involved_companies.developer,
        total_rating,
        total_rating_count,
        websites.url,
        websites.category;
      where slug = "${params.id}";
      limit 1;
    `;
    const games = await queryIgdb('games', queryBody);
    if (games.length > 0) {
      game = games[0];
    } else {
       throw new Error('Game not found.');
    }
  } catch (err) {
    console.error(err);
    error = err.message;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10">Error: {error}</div>;
  }

  if (!game) {
    return <div className="text-center mt-10">Game not found.</div>;
  }
  
  const releaseDate = game.first_release_date 
    ? new Date(game.first_release_date * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'N/A';

  return (
    <div className="p-4 md:p-6">
       <Link href="/" className="text-purple-400 hover:text-purple-300 mb-6 inline-block">&larr; Back to Games</Link>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <img
            src={getCoverUrl(game.cover?.image_id, 'cover_big_2x')}
            alt={`Cover for ${game.name}`}
            className="rounded-lg shadow-lg w-full"
            width="500"
            height="667"
          />
        </div>

        <div className="md:col-span-2">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">{game.name}</h1>
          <div className="flex items-center space-x-4 text-gray-400 mb-4">
            <span>{releaseDate}</span>
            {game.total_rating && (
                <>
                <span>&bull;</span>
                <span className="font-bold text-green-400">{Math.round(game.total_rating)}% User Score</span>
                <span className="text-sm">({game.total_rating_count} ratings)</span>
                </>
            )}
          </div>
          
          <p className="text-lg text-gray-300 mb-6">{game.summary || "No summary available."}</p>

          <div className="space-y-4">
             <div>
                <h3 className="font-semibold text-xl mb-2">Platforms</h3>
                <div className="flex flex-wrap gap-2">
                    {game.platforms?.map(p => <span key={p.id} className="bg-gray-700 px-3 py-1 rounded-full text-sm">{p.name}</span>)}
                </div>
             </div>
             <div>
                <h3 className="font-semibold text-xl mb-2">Genres</h3>
                <div className="flex flex-wrap gap-2">
                    {game.genres?.map(g => <span key={g.id} className="bg-gray-700 px-3 py-1 rounded-full text-sm">{g.name}</span>)}
                </div>
             </div>
          </div>
        </div>
      </div>

      {game.screenshots && game.screenshots.length > 0 && (
        <div className="mt-12">
            <h2 className="text-3xl font-bold mb-4">Screenshots</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {game.screenshots.slice(0, 6).map(ss => (
                    <img 
                        key={ss.id} 
                        src={getCoverUrl(ss.image_id, 'screenshot_huge')} 
                        alt="Game screenshot"
                        className="rounded-lg shadow-md"
                    />
                ))}
            </div>
        </div>
      )}
    </div>
  );
}
