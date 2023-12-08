import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { FiSun as Sun, FiMoon as Moon } from 'react-icons/fi';
import { default as cn } from 'clsx';
import { BaseComponent } from '../../types/BaseComponentTypes';

export type ThemeToggleButtonProps = BaseComponent;
export const ThemeToggleButton: React.FC<ThemeToggleButtonProps> = ({
	className = '',
}) => {
	const [mounted, setMounted] = useState(false);
	const { theme: activeTheme, setTheme } = useTheme();

	const handleToggleTheme = () => {
		if (activeTheme === 'light') {
			setTheme('dark');
		} else {
			setTheme('light');
		}
	};

	// When mounted on client, now we can show the UI
	useEffect(() => setMounted(true), []);

	if (!mounted) return null;

	return (
		<div className={cn('', className)}>
			<button
				className='bg-transparent p-2 rounded-full w-fit'
				onClick={handleToggleTheme}
			>
				{activeTheme === 'light' ? <Sun size={16} /> : <Moon size={16} />}
			</button>
		</div>
	);
};
