/*
 * Licensed under the MIT license.
 * Copyright (c) 2023 Bohdan Shtepan <bohdan@shtepan.com>
 */


import { Request, Response, NextFunction } from 'express'

export type Route = (req: Request, res: Response, next: NextFunction) => void
