import { motion } from "framer-motion";
import { Trophy, Target, Flame, BookOpen, Star, Zap, Award, Crown } from "lucide-react";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
  color: string;
}

interface AchievementBadgesProps {
  achievements: Achievement[];
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  trophy: Trophy,
  target: Target,
  flame: Flame,
  book: BookOpen,
  star: Star,
  zap: Zap,
  award: Award,
  crown: Crown,
};

const AchievementBadges = ({ achievements }: AchievementBadgesProps) => {
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-lg"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">Achievements</h3>
        <span className="text-xs text-muted-foreground">
          {unlockedCount}/{achievements.length} unlocked
        </span>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {achievements.map((achievement, index) => {
          const IconComponent = iconMap[achievement.icon] || Trophy;
          
          return (
            <motion.div
              key={achievement.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 + index * 0.05 }}
              className="relative group"
            >
              <div
                className={`
                  aspect-square rounded-xl flex items-center justify-center
                  transition-all duration-300 cursor-pointer
                  ${achievement.unlocked 
                    ? 'bg-gradient-to-br shadow-lg hover:scale-105' 
                    : 'bg-muted/20 opacity-40'
                  }
                `}
                style={achievement.unlocked ? {
                  background: `linear-gradient(135deg, ${achievement.color}30, ${achievement.color}50)`,
                  boxShadow: `0 4px 12px ${achievement.color}30`
                } : {}}
              >
                <IconComponent 
                  className={`w-6 h-6 ${achievement.unlocked ? '' : 'text-muted-foreground/50'}`}
                  style={achievement.unlocked ? { color: achievement.color } : {}}
                />
                
                {/* Lock overlay for locked achievements */}
                {!achievement.unlocked && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />
                  </div>
                )}
              </div>

              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-foreground text-background text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                <p className="font-medium">{achievement.name}</p>
                <p className="text-background/70">{achievement.description}</p>
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-foreground" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Achievement Highlight */}
      {achievements.filter(a => a.unlocked).slice(-1).map(achievement => {
        const IconComponent = iconMap[achievement.icon] || Trophy;
        return (
          <div
            key={`recent-${achievement.id}`}
            className="mt-4 pt-4 border-t border-muted/20 flex items-center gap-3"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${achievement.color}20` }}
            >
              <IconComponent className="w-5 h-5" style={{ color: achievement.color }} />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Latest Achievement</p>
              <p className="text-sm font-medium text-foreground">{achievement.name}</p>
            </div>
          </div>
        );
      })}
    </motion.div>
  );
};

export default AchievementBadges;
