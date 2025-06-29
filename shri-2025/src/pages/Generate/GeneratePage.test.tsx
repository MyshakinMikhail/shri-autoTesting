// src/pages/Generate/Generate.test.tsx
import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { GeneratePage } from './GeneratePage';

describe('GeneratePage', () => {
    const originalFetch = global.fetch;

    beforeEach(() => {
        // Заменяем fetch на mock
        global.fetch = vi.fn();
    });

    afterEach(() => {
        // Восстанавливаем оригинальный fetch после каждого теста
        global.fetch = originalFetch;
    });
    it('рендерит кнопку "Сгенерировать"', () => {
        render(
            <MemoryRouter initialEntries={['/generate']}>
                <GeneratePage />
            </MemoryRouter>
        );

        expect(screen.getAllByTestId('generate-button')[0]).toBeInTheDocument();
    });

    it('отображает лоадер при нажатии на "Сгенерировать" и затем сообщение об успехе', async () => {
        const mockBlob = new Blob([''], { type: 'text/csv' });

        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            blob: () => Promise.resolve(mockBlob),
            headers: {
                get: vi.fn().mockReturnValue('filename="report.csv"'),
            },
        });
        render(
            <MemoryRouter initialEntries={['/generate']}>
                <GeneratePage />
            </MemoryRouter>
        );

        const generateButton = screen.getAllByTestId('generate-button')[0];
        userEvent.click(generateButton);

        await waitFor(() => {
            expect(generateButton).toBeDisabled();
            expect(screen.getByTestId('loader')).toBeInTheDocument();
        });
        expect(screen.getByTestId('generate-error')).toBeInTheDocument();
    });

    it('обрабатывает ошибку сервера', async () => {
        render(
            <MemoryRouter initialEntries={['/generate']}>
                <GeneratePage />
            </MemoryRouter>
        );

        const generateButton = screen.getAllByTestId('generate-button')[0];
        fireEvent.click(generateButton);

        global.fetch = vi.fn().mockResolvedValue(
            new Response(null, {
                status: 500,
                statusText: 'Internal Server Error',
            })
        );

        await waitFor(() => {
            expect(screen.getByTestId('generate-error')).toBeInTheDocument();
        });
    });

    /* it('доступен по маршруту /generate', async () => {
        const { container } = render(
            <MemoryRouter initialEntries={['/generate']}>
                <GeneratePage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(container).toBeInTheDocument();
        });

        expect(screen.getAllByTestId('generate-button')[0]).toBeInTheDocument();
    }); */
});
