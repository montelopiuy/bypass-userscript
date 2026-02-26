-- Autofarm script for Blox Fruits (extracted from redz Hub)
-- Set _G flags to enable features (e.g., _G.AutoFarm = true)

-- World detection
World1 = game.PlaceId == 2753915549 or game.PlaceId == 85211729168715
World2 = game.PlaceId == 4442272183 or game.PlaceId == 79091703265657
World3 = game.PlaceId == 7449423635 or game.PlaceId == 100117331123089

-- Helper functions
local function round(x) return math.floor(x + 0.5) end
local function isnil(x) return x == nil end

-- AutoHaki
function AutoHaki()
    local char = game:GetService('Players').LocalPlayer.Character
    if char and not char:FindFirstChild('HasBuso') then
        game:GetService('ReplicatedStorage').Remotes.CommF_:InvokeServer('Buso')
    end
end

-- Equip/Unequip
function UnEquipWeapon(weapon)
    if game.Players.LocalPlayer.Character:FindFirstChild(weapon) then
        _G.NotAutoEquip = true
        wait(0.5)
        game.Players.LocalPlayer.Character:FindFirstChild(weapon).Parent = game.Players.LocalPlayer.Backpack
        wait(0.1)
        _G.NotAutoEquip = false
    end
end

function EquipWeapon(weapon)
    if not _G.NotAutoEquip and game.Players.LocalPlayer.Backpack:FindFirstChild(weapon) then
        local tool = game.Players.LocalPlayer.Backpack:FindFirstChild(weapon)
        wait(0.1)
        game.Players.LocalPlayer.Character.Humanoid:EquipTool(tool)
    end
end

-- Noclip control
function enableNoclip()
    local hrp = game:GetService('Players').LocalPlayer.Character:FindFirstChild('HumanoidRootPart')
    if hrp and not hrp:FindFirstChild('BodyClip') then
        local bv = Instance.new('BodyVelocity')
        bv.Name = 'BodyClip'
        bv.Parent = hrp
        bv.MaxForce = Vector3.new(100000,100000,100000)
        bv.Velocity = Vector3.new(0,0,0)
    end
end

function disableNoclip()
    local hrp = game:GetService('Players').LocalPlayer.Character:FindFirstChild('HumanoidRootPart')
    if hrp and hrp:FindFirstChild('BodyClip') then
        hrp.BodyClip:Destroy()
    end
end

function disableCollisions()
    for _, v in pairs(game.Players.LocalPlayer.Character:GetDescendants()) do
        if v:IsA('BasePart') then v.CanCollide = false end
    end
end

-- Tweening / teleport functions
local tweening = false
local tweenConnections = {}

function CheckNearestTeleporter(dest)
    local pos = dest.Position
    local minDist = math.huge
    local nearest = nil
    local teleports = {}
    if game.PlaceId == 2753915549 then
        teleports = {
            Sky3 = Vector3.new(-7894,5547,-380),
            Sky3Exit = Vector3.new(-4607,874,-1667),
            UnderWater = Vector3.new(61163,11,1819),
            UnderwaterCity = Vector3.new(61165.19,0.187,1897.38),
            PirateVillage = Vector3.new(-1242.46,4.787,3901.28),
            UnderwaterExit = Vector3.new(4050,-1,-1814)
        }
    elseif game.PlaceId == 4442272183 then
        teleports = {
            SwanMansion = Vector3.new(-390,332,673),
            SwanRoom = Vector3.new(2285,15,905),
            CursedShip = Vector3.new(923,126,32852),
            ZombieIsland = Vector3.new(-6509,83,-133)
        }
    elseif game.PlaceId == 7449423635 then
        teleports = {
            FloatingTurtle = Vector3.new(-12462,375,-7552),
            HydraIsland = Vector3.new(5657.88,1013.08,-335.5),
            Mansion = Vector3.new(-12462,375,-7552),
            Castle = Vector3.new(-5036,315,-3179),
            DimensionalShift = Vector3.new(-2097.34,4776.24,-15013.5),
            BeautifulPirate = Vector3.new(5319,23,-93),
            BeautifulRoom = Vector3.new(5314.58,22.54,-125.94),
            TempleOfTime = Vector3.new(28286,14897,103)
        }
    end
    for name, tpPos in pairs(teleports) do
        local dist = (tpPos - pos).Magnitude
        if dist < minDist then
            nearest = tpPos
            minDist = dist
        end
    end
    if minDist <= (pos - game.Players.LocalPlayer.Character.HumanoidRootPart.Position).Magnitude then
        return nearest
    end
end

function requestEntrance(pos)
    game.ReplicatedStorage.Remotes.CommF_:InvokeServer('requestEntrance', pos)
    local hrp = game.Players.LocalPlayer.Character.HumanoidRootPart
    hrp.CFrame = hrp.CFrame + Vector3.new(0,50,0)
    task.wait(0.5)
end

function topos(dest)
    local player = game.Players.LocalPlayer
    if not (player.Character and player.Character.Humanoid.Health > 0 and player.Character:FindFirstChild('HumanoidRootPart')) then return end
    if not dest then return end

    local tele = CheckNearestTeleporter(dest)
    if tele then requestEntrance(tele) end

    if not player.Character:FindFirstChild('PartTele') then
        local part = Instance.new('Part', player.Character)
        part.Size = Vector3.new(10,1,10)
        part.Name = 'PartTele'
        part.Anchored = true
        part.Transparency = 1
        part.CanCollide = true
        part.CFrame = player.Character.HumanoidRootPart.CFrame
        part:GetPropertyChangedSignal('CFrame'):Connect(function()
            if tweening then
                task.wait()
                if player.Character and player.Character:FindFirstChild('HumanoidRootPart') then
                    player.Character.HumanoidRootPart.CFrame = part.CFrame
                end
            end
        end)
    end

    tweening = true
    local dist = (dest.Position - player.Character.HumanoidRootPart.Position).Magnitude
    local tween = game:GetService('TweenService'):Create(
        player.Character.PartTele,
        TweenInfo.new(dist/360, Enum.EasingStyle.Linear),
        {CFrame = dest}
    )
    tween:Play()
    tween.Completed:Connect(function(state)
        if state == Enum.PlaybackState.Completed then
            if player.Character:FindFirstChild('PartTele') then
                player.Character.PartTele:Destroy()
            end
            tweening = false
        end
    end)
end

function stopTeleport()
    tweening = false
    local player = game.Players.LocalPlayer
    if player.Character and player.Character:FindFirstChild('PartTele') then
        player.Character.PartTele:Destroy()
    end
end

function TP1(pos) topos(pos) end

-- CheckQuest (must be defined before use)
function CheckQuest()
    MyLevel = game:GetService('Players').LocalPlayer.Data.Level.Value

    if World1 then
        if (MyLevel < 1 or MyLevel > 9) and SelectMonster ~= 'Bandit' then
            if (MyLevel < 10 or MyLevel > 14) and SelectMonster ~= 'Monkey' then
                if (MyLevel < 15 or MyLevel > 29) and SelectMonster ~= 'Gorilla' then
                    if (MyLevel < 30 or MyLevel > 39) and SelectMonster ~= 'Pirate' then
                        if (MyLevel < 40 or MyLevel > 59) and SelectMonster ~= 'Brute' then
                            if (MyLevel < 60 or MyLevel > 74) and SelectMonster ~= 'Desert Bandit' then
                                if (MyLevel < 75 or MyLevel > 89) and SelectMonster ~= 'Desert Officer' then
                                    if (MyLevel < 90 or MyLevel > 99) and SelectMonster ~= 'Snow Bandit' then
                                        if (MyLevel < 100 or MyLevel > 119) and SelectMonster ~= 'Snowman' then
                                            if (MyLevel < 120 or MyLevel > 149) and SelectMonster ~= 'Chief Petty Officer' then
                                                if (MyLevel < 150 or MyLevel > 174) and SelectMonster ~= 'Sky Bandit' then
                                                    if (MyLevel < 175 or MyLevel > 189) and SelectMonster ~= 'Dark Master' then
                                                        if (MyLevel < 190 or MyLevel > 209) and SelectMonster ~= 'Prisoner' then
                                                            if (MyLevel < 210 or MyLevel > 249) and SelectMonster ~= 'Dangerous Prisone' then
                                                                if (MyLevel < 250 or MyLevel > 274) and SelectMonster ~= 'Toga Warrior' then
                                                                    if (MyLevel < 275 or MyLevel > 299) and SelectMonster ~= 'Gladiator' then
                                                                        if (MyLevel < 300 or MyLevel > 324) and SelectMonster ~= 'Military Soldier' then
                                                                            if (MyLevel < 325 or MyLevel > 374) and SelectMonster ~= 'Military Spy' then
                                                                                if (MyLevel < 375 or MyLevel > 399) and SelectMonster ~= 'Fishman Warrior' then
                                                                                    if (MyLevel < 400 or MyLevel > 449) and SelectMonster ~= 'Fishman Commando' then
                                                                                        if (MyLevel < 450 or MyLevel > 474) and SelectMonster ~= "God's Guard" then
                                                                                            if (MyLevel < 475 or MyLevel > 524) and SelectMonster ~= 'Shanda' then
                                                                                                if (MyLevel < 525 or MyLevel > 549) and SelectMonster ~= 'Royal Squad' then
                                                                                                    if (MyLevel < 550 or MyLevel > 624) and SelectMonster ~= 'Royal Soldier' then
                                                                                                        if (MyLevel < 625 or MyLevel > 649) and SelectMonster ~= 'Galley Pirate' then
                                                                                                            if MyLevel >= 650 or SelectMonster == 'Galley Captain' then
                                                                                                                Mon = 'Galley Captain'
                                                                                                                LevelQuest = 2
                                                                                                                NameQuest = 'FountainQuest'
                                                                                                                NameMon = 'Galley Captain'
                                                                                                                CFrameQuest = CFrame.new(5259.81982, 37.3500175, 4050.0293, 0.087131381, -0, 0.996196866, -0, 1, -0, -0.996196866, -0, 0.087131381)
                                                                                                                CFrameMon = CFrame.new(5441.95166015625, 42.50205993652344, 4950.09375)
                                                                                                            end
                                                                                                        else
                                                                                                            Mon = 'Galley Pirate'
                                                                                                            LevelQuest = 1
                                                                                                            NameQuest = 'FountainQuest'
                                                                                                            NameMon = 'Galley Pirate'
                                                                                                            CFrameQuest = CFrame.new(5259.81982, 37.3500175, 4050.0293, 0.087131381, -0, 0.996196866, -0, 1, -0, -0.996196866, -0, 0.087131381)
                                                                                                            CFrameMon = CFrame.new(5551.02197265625, 78.90135192871094, 3930.412841796875)
                                                                                                        end
                                                                                                    else
                                                                                                        Mon = 'Royal Soldier'
                                                                                                        LevelQuest = 2
                                                                                                        NameQuest = 'SkyExp2Quest'
                                                                                                        NameMon = 'Royal Soldier'
                                                                                                        CFrameQuest = CFrame.new(-7906.81592, 5634.6626, -1411.99194, -0, -0, -1, -0, 1, -0, 1, -0, -0)
                                                                                                        CFrameMon = CFrame.new(-7836.75341796875, 5645.6640625, -1790.6236572265625)
                                                                                                    end
                                                                                                else
                                                                                                    Mon = 'Royal Squad'
                                                                                                    LevelQuest = 1
                                                                                                    NameQuest = 'SkyExp2Quest'
                                                                                                    NameMon = 'Royal Squad'
                                                                                                    CFrameQuest = CFrame.new(-7906.81592, 5634.6626, -1411.99194, -0, -0, -1, -0, 1, -0, 1, -0, -0)
                                                                                                    CFrameMon = CFrame.new(-7624.25244140625, 5658.13330078125, -1467.354248046875)
                                                                                                end
                                                                                            else
                                                                                                Mon = 'Shanda'
                                                                                                LevelQuest = 2
                                                                                                NameQuest = 'SkyExp1Quest'
                                                                                                NameMon = 'Shanda'
                                                                                                CFrameQuest = CFrame.new(-7859.09814, 5544.19043, -381.476196, -0.422592998, -0, 0.906319618, -0, 1, -0, -0.906319618, -0, -0.422592998)
                                                                                                CFrameMon = CFrame.new(-7678.48974609375, 5566.40380859375, -497.2156066894531)
                                                                                                if _G.AutoFarm and (CFrameQuest.Position - game.Players.LocalPlayer.Character.HumanoidRootPart.Position).Magnitude > 10000 then
                                                                                                    game:GetService('ReplicatedStorage').Remotes.CommF_:InvokeServer('requestEntrance', Vector3.new(-7894.6176757813, 5547.1416015625, -380.29119873047))
                                                                                                end
                                                                                            end
                                                                                        else
                                                                                            Mon = "God's Guard"
                                                                                            LevelQuest = 1
                                                                                            NameQuest = 'SkyExp1Quest'
                                                                                            NameMon = "God's Guard"
                                                                                            CFrameQuest = CFrame.new(-4721.88867, 843.874695, -1949.96643, 0.996191859, -0, -0.0871884301, -0, 1, -0, 0.0871884301, -0, 0.996191859)
                                                                                            CFrameMon = CFrame.new(-4710.04296875, 845.2769775390625, -1927.3079833984375)
                                                                                            if _G.AutoFarm and (CFrameQuest.Position - game.Players.LocalPlayer.Character.HumanoidRootPart.Position).Magnitude > 10000 then
                                                                                                game:GetService('ReplicatedStorage').Remotes.CommF_:InvokeServer('requestEntrance', Vector3.new(-4607.82275, 872.54248, -1667.55688))
                                                                                            end
                                                                                        end
                                                                                    else
                                                                                        Mon = 'Fishman Commando'
                                                                                        LevelQuest = 2
                                                                                        NameQuest = 'FishmanQuest'
                                                                                        NameMon = 'Fishman Commando'
                                                                                        CFrameQuest = CFrame.new(61122.65234375, 18.497442245483, 1569.3997802734)
                                                                                        CFrameMon = CFrame.new(61922.6328125, 18.482830047607422, 1493.934326171875)
                                                                                        if _G.AutoFarm and (CFrameQuest.Position - game.Players.LocalPlayer.Character.HumanoidRootPart.Position).Magnitude > 10000 then
                                                                                            game:GetService('ReplicatedStorage').Remotes.CommF_:InvokeServer('requestEntrance', Vector3.new(61163.8515625, 11.6796875, 1819.7841796875))
                                                                                        end
                                                                                    end
                                                                                else
                                                                                    Mon = 'Fishman Warrior'
                                                                                    LevelQuest = 1
                                                                                    NameQuest = 'FishmanQuest'
                                                                                    NameMon = 'Fishman Warrior'
                                                                                    CFrameQuest = CFrame.new(61122.65234375, 18.497442245483, 1569.3997802734)
                                                                                    CFrameMon = CFrame.new(60878.30078125, 18.482830047607422, 1543.7574462890625)
                                                                                    if _G.AutoFarm and (CFrameQuest.Position - game.Players.LocalPlayer.Character.HumanoidRootPart.Position).Magnitude > 10000 then
                                                                                        game:GetService('ReplicatedStorage').Remotes.CommF_:InvokeServer('requestEntrance', Vector3.new(61163.8515625, 11.6796875, 1819.7841796875))
                                                                                    end
                                                                                end
                                                                            else
                                                                                Mon = 'Military Spy'
                                                                                LevelQuest = 2
                                                                                NameQuest = 'MagmaQuest'
                                                                                NameMon = 'Military Spy'
                                                                                CFrameQuest = CFrame.new(-5313.37012, 10.9500084, 8515.29395, -0.499959469, -0, 0.866048813, -0, 1, -0, -0.866048813, -0, -0.499959469)
                                                                                CFrameMon = CFrame.new(-5802.8681640625, 86.26241302490234, 8828.859375)
                                                                            end
                                                                        else
                                                                            Mon = 'Military Soldier'
                                                                            LevelQuest = 1
                                                                            NameQuest = 'MagmaQuest'
                                                                            NameMon = 'Military Soldier'
                                                                            CFrameQuest = CFrame.new(-5313.37012, 10.9500084, 8515.29395, -0.499959469, -0, 0.866048813, -0, 1, -0, -0.866048813, -0, -0.499959469)
                                                                            CFrameMon = CFrame.new(-5411.16455078125, 11.081554412841797, 8454.29296875)
                                                                        end
                                                                    else
                                                                        Mon = 'Gladiator'
                                                                        LevelQuest = 2
                                                                        NameQuest = 'ColosseumQuest'
                                                                        NameMon = 'Gladiator'
                                                                        CFrameQuest = CFrame.new(-1580.04663, 6.35000277, -2986.47534, -0.515037298, -0, -0.857167721, -0, 1, -0, 0.857167721, -0, -0.515037298)
                                                                        CFrameMon = CFrame.new(-1292.838134765625, 56.380882263183594, -3339.031494140625)
                                                                    end
                                                                else
                                                                    Mon = 'Toga Warrior'
                                                                    LevelQuest = 1
                                                                    NameQuest = 'ColosseumQuest'
                                                                    NameMon = 'Toga Warrior'
                                                                    CFrameQuest = CFrame.new(-1580.04663, 6.35000277, -2986.47534, -0.515037298, -0, -0.857167721, -0, 1, -0, 0.857167721, -0, -0.515037298)
                                                                    CFrameMon = CFrame.new(-1820.21484375, 51.68385696411133, -2740.6650390625)
                                                                end
                                                            else
                                                                Mon = 'Dangerous Prisoner'
                                                                LevelQuest = 2
                                                                NameQuest = 'PrisonerQuest'
                                                                NameMon = 'Dangerous Prisoner'
                                                                CFrameQuest = CFrame.new(5308.93115, 1.65517521, 475.120514, -0.0894274712, -5.00292918e-9, -0.995993316, 1.60817859e-9, 1, -5.16744869e-9, 0.995993316, -2.06384709e-9, -0.0894274712)
                                                                CFrameMon = CFrame.new(5654.5634765625, 15.633401870727539, 866.2991943359375)
                                                            end
                                                        else
                                                            Mon = 'Prisoner'
                                                            LevelQuest = 1
                                                            NameQuest = 'PrisonerQuest'
                                                            NameMon = 'Prisoner'
                                                            CFrameQuest = CFrame.new(5308.93115, 1.65517521, 475.120514, -0.0894274712, -5.00292918e-9, -0.995993316, 1.60817859e-9, 1, -5.16744869e-9, 0.995993316, -2.06384709e-9, -0.0894274712)
                                                            CFrameMon = CFrame.new(5098.9736328125, -0.3204058110713959, 474.2373352050781)
                                                        end
                                                    else
                                                        Mon = 'Dark Master'
                                                        LevelQuest = 2
                                                        NameQuest = 'SkyQuest'
                                                        NameMon = 'Dark Master'
                                                        CFrameQuest = CFrame.new(-4839.53027, 716.368591, -2619.44165, 0.866007268, -0, 0.500031412, -0, 1, -0, -0.500031412, -0, 0.866007268)
                                                        CFrameMon = CFrame.new(-5259.8447265625, 391.3976745605469, -2229.035400390625)
                                                    end
                                                else
                                                    Mon = 'Sky Bandit'
                                                    LevelQuest = 1
                                                    NameQuest = 'SkyQuest'
                                                    NameMon = 'Sky Bandit'
                                                    CFrameQuest = CFrame.new(-4839.53027, 716.368591, -2619.44165, 0.866007268, -0, 0.500031412, -0, 1, -0, -0.500031412, -0, 0.866007268)
                                                    CFrameMon = CFrame.new(-4953.20703125, 295.74420166015625, -2899.22900390625)
                                                end
                                            else
                                                Mon = 'Chief Petty Officer'
                                                LevelQuest = 1
                                                NameQuest = 'MarineQuest2'
                                                NameMon = 'Chief Petty Officer'
                                                CFrameQuest = CFrame.new(-5039.58643, 27.3500385, 4324.68018, -0, -0, -1, -0, 1, -0, 1, -0, -0)
                                                CFrameMon = CFrame.new(-4881.23095703125, 22.65204429626465, 4273.75244140625)
                                            end
                                        else
                                            Mon = 'Snowman'
                                            LevelQuest = 2
                                            NameQuest = 'SnowQuest'
                                            NameMon = 'Snowman'
                                            CFrameQuest = CFrame.new(1389.74451, 88.1519318, -1298.90796, -0.342042685, -0, 0.939684391, -0, 1, -0, -0.939684391, -0, -0.342042685)
                                            CFrameMon = CFrame.new(1201.6412353515625, 144.57958984375, -1550.0670166015625)
                                        end
                                    else
                                        Mon = 'Snow Bandit'
                                        LevelQuest = 1
                                        NameQuest = 'SnowQuest'
                                        NameMon = 'Snow Bandit'
                                        CFrameQuest = CFrame.new(1389.74451, 88.1519318, -1298.90796, -0.342042685, -0, 0.939684391, -0, 1, -0, -0.939684391, -0, -0.342042685)
                                        CFrameMon = CFrame.new(1354.347900390625, 87.27277374267578, -1393.946533203125)
                                    end
                                else
                                    Mon = 'Desert Officer'
                                    LevelQuest = 2
                                    NameQuest = 'DesertQuest'
                                    NameMon = 'Desert Officer'
                                    CFrameQuest = CFrame.new(894.488647, 5.14000702, 4392.43359, 0.819155693, -0, -0.573571265, -0, 1, -0, 0.573571265, -0, 0.819155693)
                                    CFrameMon = CFrame.new(1608.2822265625, 8.614224433898926, 4371.00732421875)
                                end
                            else
                                Mon = 'Desert Bandit'
                                LevelQuest = 1
                                NameQuest = 'DesertQuest'
                                NameMon = 'Desert Bandit'
                                CFrameQuest = CFrame.new(894.488647, 5.14000702, 4392.43359, 0.819155693, -0, -0.573571265, -0, 1, -0, 0.573571265, -0, 0.819155693)
                                CFrameMon = CFrame.new(924.7998046875, 6.44867467880249, 4481.5859375)
                            end
                        else
                            Mon = 'Brute'
                            LevelQuest = 2
                            NameQuest = 'BuggyQuest1'
                            NameMon = 'Brute'
                            CFrameQuest = CFrame.new(-1141.07483, 4.10001802, 3831.5498, 0.965929627, -0, -0.258804798, -0, 1, -0, 0.258804798, -0, 0.965929627)
                            CFrameMon = CFrame.new(-1140.083740234375, 14.809885025024414, 4322.92138671875)
                        end
                    else
                        Mon = 'Pirate'
                        LevelQuest = 1
                        NameQuest = 'BuggyQuest1'
                        NameMon = 'Pirate'
                        CFrameQuest = CFrame.new(-1141.07483, 4.10001802, 3831.5498, 0.965929627, -0, -0.258804798, -0, 1, -0, 0.258804798, -0, 0.965929627)
                        CFrameMon = CFrame.new(-1103.513427734375, 13.752052307128906, 3896.091064453125)
                    end
                else
                    Mon = 'Gorilla'
                    LevelQuest = 2
                    NameQuest = 'JungleQuest'
                    NameMon = 'Gorilla'
                    CFrameQuest = CFrame.new(-1598.08911, 35.5501175, 153.377838, -0, -0, 1, -0, 1, -0, -1, -0, -0)
                    CFrameMon = CFrame.new(-1129.8836669921875, 40.46354675292969, -525.4237060546875)
                end
            else
                Mon = 'Monkey'
                LevelQuest = 1
                NameQuest = 'JungleQuest'
                NameMon = 'Monkey'
                CFrameQuest = CFrame.new(-1598.08911, 35.5501175, 153.377838, -0, -0, 1, -0, 1, -0, -1, -0, -0)
                CFrameMon = CFrame.new(-1448.51806640625, 67.85301208496094, 11.46579647064209)
            end
        else
            Mon = 'Bandit'
            LevelQuest = 1
            NameQuest = 'BanditQuest1'
            NameMon = 'Bandit'
            CFrameQuest = CFrame.new(1059.37195, 15.4495068, 1550.4231, 0.939700544, -0, -0.341998369, -0, 1, -0, 0.341998369, -0, 0.939700544)
            CFrameMon = CFrame.new(1045.962646484375, 27.00250816345215, 1560.8203125)
        end
    elseif World2 then
        -- (abbreviated for space; include full from original)
        -- ... (full CheckQuest for World2 and World3 omitted for brevity, but must be included in actual script)
    elseif World3 then
        -- ... (full CheckQuest for World3)
    end
end

-- MaterialMon (for material farm)
function MaterialMon()
    -- (full function from original)
    -- ...
end

-- Main autofarm loops

-- Auto Farm Level
spawn(function()
    while task.wait() do
        if _G.AutoFarm then
            pcall(function()
                local questText = game:GetService('Players').LocalPlayer.PlayerGui.Main.Quest.Container.QuestTitle.Title.Text
                CheckQuest()
                if not string.find(questText, NameMon) then
                    _G.StartBring = false
                    game:GetService('ReplicatedStorage').Remotes.CommF_:InvokeServer('AbandonQuest')
                end
                if game:GetService('Players').LocalPlayer.PlayerGui.Main.Quest.Visible == false then
                    _G.StartBring = false
                    TP1(CFrameQuest)
                    if (game.Players.LocalPlayer.Character.HumanoidRootPart.Position - CFrameQuest.Position).Magnitude <= 20 then
                        game:GetService('ReplicatedStorage').Remotes.CommF_:InvokeServer('StartQuest', NameQuest, LevelQuest)
                    end
                elseif game:GetService('Players').LocalPlayer.PlayerGui.Main.Quest.Visible == true then
                    if string.find(questText, 'kissed') then
                        -- handle kissed warrior
                    elseif game:GetService('Workspace').Enemies:FindFirstChild(Mon) then
                        for _, mob in pairs(game:GetService('Workspace').Enemies:GetChildren()) do
                            if mob:FindFirstChild('HumanoidRootPart') and mob:FindFirstChild('Humanoid') and mob.Humanoid.Health > 0 and mob.Name == Mon then
                                if string.find(questText, NameMon) then
                                    repeat
                                        task.wait()
                                        EquipWeapon(_G.SelectWeapon)
                                        AutoHaki()
                                        _G.PosMon = mob.HumanoidRootPart.CFrame
                                        topos(mob.HumanoidRootPart.CFrame * CFrame.new(0,30,0))
                                        mob.HumanoidRootPart.CanCollide = false
                                        mob.Humanoid.WalkSpeed = 0
                                        mob.Head.CanCollide = false
                                        mob.HumanoidRootPart.Size = Vector3.new(70,70,70)
                                        _G.StartBring = true
                                        _G.MonFarm = mob.Name
                                        game:GetService('VirtualUser'):CaptureController()
                                        game:GetService('VirtualUser'):Button1Down(Vector2.new(1280,672))
                                    until not _G.AutoFarm or mob.Humanoid.Health <= 0 or not mob.Parent or game:GetService('Players').LocalPlayer.PlayerGui.Main.Quest.Visible == false
                                else
                                    _G.StartBring = false
                                    game:GetService('ReplicatedStorage').Remotes.CommF_:InvokeServer('AbandonQuest')
                                end
                            end
                        end
                    else
                        TP1(CFrameMon)
                        _G.StartBring = false
                        if game:GetService('ReplicatedStorage'):FindFirstChild(Mon) then
                            TP1(game:GetService('ReplicatedStorage'):FindFirstChild(Mon).HumanoidRootPart.CFrame * CFrame.new(0,20,0))
                        end
                    end
                end
            end)
        end
    end
end)

-- Auto Farm Level New
function CheckQuestNew()
    -- (full function from original)
    -- ...
end
spawn(function()
    while task.wait() do
        if _G.AutoFarmLevelNew then
            pcall(function()
                local quest = game:GetService('Players').LocalPlayer.PlayerGui.Main.Quest
                CheckQuestNew()
                if quest.Visible ~= false then
                    for _, mob in pairs(game:GetService('Workspace').Enemies:GetChildren()) do
                        if mob.Name == MonNew and mob:FindFirstChild('HumanoidRootPart') and mob:FindFirstChild('Humanoid') and mob.Humanoid.Health > 0 then
                            if string.find(quest.Container.QuestTitle.Title.Text, NameMonNew) then
                                repeat
                                    task.wait()
                                    EquipWeapon(_G.SelectWeapon)
                                    AutoHaki()
                                    topos(mob.HumanoidRootPart.CFrame * CFrame.new(0,30,0))
                                    mob.HumanoidRootPart.CanCollide = false
                                    mob.Humanoid.WalkSpeed = 0
                                    mob.Head.CanCollide = false
                                    mob.HumanoidRootPart.Size = Vector3.new(70,70,70)
                                    _G.StartBring = true
                                    _G.MonFarmNew = mob.Name
                                    game:GetService('VirtualUser'):CaptureController()
                                    game:GetService('VirtualUser'):Button1Down(Vector2.new(1280,672))
                                until not _G.AutoFarmLevelNew or mob.Humanoid.Health <= 0 or not mob.Parent or quest.Visible == false
                            else
                                _G.StartBring = false
                                game:GetService('ReplicatedStorage').Remotes.CommF_:InvokeServer('AbandonQuest')
                            end
                        end
                    end
                    if not game:GetService('Workspace').Enemies:FindFirstChild(MonNew) then
                        TP1(CFrameMonNew)
                        _G.StartBring = false
                    end
                else
                    _G.StartBring = false
                    if (game.Players.LocalPlayer.Character.HumanoidRootPart.Position - CFrameQuestNew.Position).Magnitude <= 20 then
                        game:GetService('ReplicatedStorage').Remotes.CommF_:InvokeServer('StartQuest', NameQuestNew, LevelQuestNew)
                    else
                        TP1(CFrameQuestNew)
                    end
                end
            end)
        end
    end
end)

-- Auto Kill Near (Mob Aura)
spawn(function()
    while wait() do
        if _G.AutoNear then
            pcall(function()
                for _, mob in pairs(game.Workspace.Enemies:GetChildren()) do
                    if mob:FindFirstChild('Humanoid') and mob:FindFirstChild('HumanoidRootPart') and mob.Humanoid.Health > 0 and (game.Players.LocalPlayer.Character.HumanoidRootPart.Position - mob.HumanoidRootPart.Position).Magnitude <= 5000 then
                        repeat
                            wait(_G.Fast_Delay or 0.1)
                            _G.StartBring = true
                            AutoHaki()
                            EquipWeapon(_G.SelectWeapon)
                            topos(mob.HumanoidRootPart.CFrame * CFrame.new(0,30,0))
                            mob.HumanoidRootPart.Size = Vector3.new(60,60,60)
                            mob.HumanoidRootPart.Transparency = 1
                            mob.Humanoid.JumpPower = 0
                            mob.Humanoid.WalkSpeed = 0
                            mob.HumanoidRootPart.CanCollide = false
                            _G.FarmPos = mob.HumanoidRootPart.CFrame
                            _G.MonFarm = mob.Name
                        until not _G.AutoNear or not mob.Parent or mob.Humanoid.Health <= 0
                        _G.StartBring = false
                    end
                end
            end)
        end
    end
end)

-- Auto Farm Boss
task.spawn(function()
    while task.wait() do
        if _G.BossPain and _G.SelectBoss then
            pcall(function()
                if game:GetService('Workspace').Enemies:FindFirstChild(_G.SelectBoss) then
                    for _, boss in pairs(game:GetService('Workspace').Enemies:GetChildren()) do
                        if boss.Name == _G.SelectBoss and boss:FindFirstChild('Humanoid') and boss:FindFirstChild('HumanoidRootPart') and boss.Humanoid.Health > 0 then
                            repeat
                                task.wait()
                                AutoHaki()
                                EquipWeapon(_G.SelectWeapon)
                                boss.HumanoidRootPart.CanCollide = false
                                boss.Humanoid.WalkSpeed = 0
                                boss.HumanoidRootPart.Size = Vector3.new(80,80,80)
                                topos(boss.HumanoidRootPart.CFrame * CFrame.new(0,30,0))
                                sethiddenproperty(game:GetService('Players').LocalPlayer, 'SimulationRadius', math.huge)
                            until not _G.BossPain or not boss.Parent or boss.Humanoid.Health <= 0
                        end
                    end
                elseif game:GetService('ReplicatedStorage'):FindFirstChild(_G.SelectBoss) then
                    topos(game:GetService('ReplicatedStorage'):FindFirstChild(_G.SelectBoss).HumanoidRootPart.CFrame * CFrame.new(5,10,2))
                end
            end)
        end
    end
end)

-- AutoRaidPirate
spawn(function()
    while wait() do
        if _G.AutoRaidPirate then
            pcall(function()
                local raidPos = CFrame.new(-5496.17432,313.768921,-2841.53027)
                if (CFrame.new(-5539.3115,313.8005,-2972.3723).Position - game.Players.LocalPlayer.Character.HumanoidRootPart.Position).Magnitude > 500 then
                    if (raidPos.Position - game.Players.LocalPlayer.Character.HumanoidRootPart.Position).magnitude > 1500 then
                        TP1(raidPos)
                    else
                        TP1(raidPos)
                    end
                else
                    for _, mob in pairs(game:GetService('Workspace').Enemies:GetChildren()) do
                        if _G.AutoRaidPirate and mob:FindFirstChild('HumanoidRootPart') and mob:FindFirstChild('Humanoid') and mob.Humanoid.Health > 0 and (mob.HumanoidRootPart.Position - game.Players.LocalPlayer.Character.HumanoidRootPart.Position).Magnitude < 2000 then
                            repeat
                                wait()
                                AutoHaki()
                                EquipWeapon(_G.SelectWeapon)
                                _G.NeedAttacking = true
                                _G.StartMagnet = true
                                mob.HumanoidRootPart.CanCollide = false
                                mob.HumanoidRootPart.Size = Vector3.new(60,60,60)
                                topos(mob.HumanoidRootPart.CFrame * CFrame.new(0,30,0))
                            until mob.Humanoid.Health <= 0 or not mob.Parent or _G.AutoRaidPirate == false
                            _G.NeedAttacking = false
                            _G.StartMagnet = false
                        end
                    end
                end
            end)
        end
    end
end)

-- Auto Farm Tyrant
task.spawn(function()
    while task.wait() do
        if _G.FarmDaiBan then
            pcall(function()
                if game:GetService('Workspace').Enemies:FindFirstChild('Tyrant of the Skies') then
                    for _, mob in pairs(game:GetService('Workspace').Enemies:GetChildren()) do
                        if mob.Name == 'Tyrant of the Skies' and mob:FindFirstChild('Humanoid') and mob:FindFirstChild('HumanoidRootPart') and mob.Humanoid.Health > 0 then
                            repeat
                                task.wait()
                                AutoHaki()
                                EquipWeapon(_G.SelectWeapon)
                                mob.HumanoidRootPart.CanCollide = false
                                mob.Humanoid.WalkSpeed = 0
                                mob.HumanoidRootPart.Size = Vector3.new(50,50,50)
                                topos(mob.HumanoidRootPart.CFrame * CFrame.new(0,40,0))
                                _G.NeedAttacking = true
                            until not _G.FarmDaiBan or not mob.Parent or mob.Humanoid.Health <= 0
                            wait(1)
                        end
                    end
                    return
                end
                -- else kill mini mobs to spawn boss (full logic in original)
            end)
        end
    end
end)

-- Farm Katakuri
task.spawn(function()
    while task.wait() do
        if _G.FarmCake then
            pcall(function()
                -- full logic in original
            end)
        end
    end
end)

-- Farm Katakuri V2
spawn(function()
    while wait() do
        if _G.Fullykatakuri then
            pcall(function()
                -- full logic in original
            end)
        end
    end
end)

-- Auto Farm Material
task.spawn(function()
    while task.wait(0.2) do
        if _G.AutoFarmMaterial and _G.SelectMaterial then
            pcall(function()
                getConfigMaterial(_G.SelectMaterial) -- defined elsewhere in original
                for _, monName in pairs(MaterialMon) do
                    if workspace.Enemies:FindFirstChild(monName) then
                        for _, mob in pairs(workspace.Enemies:GetChildren()) do
                            if mob.Name == monName and mob:FindFirstChild('Humanoid') and mob:FindFirstChild('HumanoidRootPart') and mob.Humanoid.Health > 0 then
                                repeat
                                    task.wait()
                                    AutoHaki()
                                    EquipWeapon(_G.SelectWeapon)
                                    _G.PosMon = mob.HumanoidRootPart.CFrame
                                    _G.MonFarm = mob.Name
                                    topos(mob.HumanoidRootPart.CFrame * CFrame.new(0,30,0))
                                until not _G.AutoFarmMaterial or not mob.Parent or mob.Humanoid.Health <= 0
                            end
                        end
                    else
                        UnEquipWeapon(_G.SelectWeapon)
                        if _G.SelectMaterial == 'Ectoplasm' and (MaterialPos.Position - game.Players.LocalPlayer.Character.HumanoidRootPart.Position).Magnitude > 18000 then
                            game.ReplicatedStorage.Remotes.CommF_:InvokeServer('requestEntrance', Vector3.new(923.21,126.97,32852.83))
                        end
                        topos(MaterialPos)
                    end
                end
            end)
        end
    end
end)

-- Auto Farm Chest
spawn(function()
    while wait() do
        if _G.FarmChest then
            pcall(function()
                local player = game:GetService('Players').LocalPlayer
                local pos = player.Character and player.Character:GetPivot().Position
                local chests = game:GetService('CollectionService'):GetTagged('_ChestTagged')
                local minDist = math.huge
                local target = nil
                for _, chest in ipairs(chests) do
                    if not chest:GetAttribute('IsDisabled') then
                        local dist = (chest:GetPivot().Position - pos).Magnitude
                        if dist < minDist then
                            target = chest
                            minDist = dist
                        end
                    end
                end
                if target then
                    topos(CFrame.new(target:GetPivot().Position))
                end
            end)
        end
    end
end)

-- Auto Collect Berry
spawn(function()
    while wait() do
        if _G.CollectBerry then
            -- full logic in original
        end
    end
end)

-- Bring monster (if enabled)
spawn(function()
    while task.wait() do
        pcall(function()
            if _G.BringMonster and _G.StartBring then
                for _, mob in pairs(game:GetService('Workspace').Enemies:GetChildren()) do
                    if (mob.Name == _G.MonFarm or mob.Name == Mon) and mob:FindFirstChild('Humanoid') and mob:FindFirstChild('HumanoidRootPart') and mob.Humanoid.Health > 0 and (mob.HumanoidRootPart.Position - game.Players.LocalPlayer.Character.HumanoidRootPart.Position).Magnitude <= 320 then
                        if mob.Name ~= 'Factory Staff' then
                            if (mob.HumanoidRootPart.Position - _G.PosMon.Position).Magnitude <= 320 then
                                mob.HumanoidRootPart.Size = Vector3.new(60,60,60)
                                mob.HumanoidRootPart.CFrame = _G.PosMon
                                mob.HumanoidRootPart.CanCollide = false
                                mob.Head.CanCollide = false
                                if mob.Humanoid:FindFirstChild('Animator') then mob.Humanoid.Animator:Destroy() end
                                sethiddenproperty(game.Players.LocalPlayer, 'SimulationRadius', math.huge)
                            end
                        elseif (mob.HumanoidRootPart.Position - _G.PosMon.Position).Magnitude <= 250 then
                            mob.Head.CanCollide = false
                            mob.HumanoidRootPart.CanCollide = false
                            mob.HumanoidRootPart.Size = Vector3.new(60,60,60)
                            mob.HumanoidRootPart.CFrame = _G.PosMon
                            if mob.Humanoid:FindFirstChild('Animator') then mob.Humanoid.Animator:Destroy() end
                            sethiddenproperty(game.Players.LocalPlayer, 'SimulationRadius', math.huge)
                        end
                    end
                end
            end
        end)
    end
end)

-- Noclip enabler (when any farming feature is on)
spawn(function()
    while task.wait() do
        pcall(function()
            if _G.FarmBone or _G.AutoFarm or _G.Pray or _G.Trylux or _G.Hallow or _G.FarmCake or _G.FarmDaiBan or _G.Fullykatakuri or _G.AutoBoss or _G.AutoMateria or _G.AutoSecondSea or _G.Autosaw or _G.ChiefWarden or _G.Trident or _G.AutoSaber or _G.Greybeard or _G.CursedCaptain or _G.AutoDarkBoss or _G.Longsword or _G.GravityBlade or _G.SwodsFlail or _G.AutoRengoku or _G.SwodsDRTrident or _G.SwodCanvande or _G.SwodTwinHooks or _G.ThirdSea or _G.AutoBartilo or _G.AutoFactory or _G.SwodsBuddy or _G.FarmBlazeEM or _G.AutoFindPrehistoric or _G.TweenVolcano or _G.DefendVolcano or _G.KillGolem or _G.AutoRaidPirate or _G.AutoQuestYama or _G.AutoYamaQuest or _G.AutoElitehunter or FarmMtrFruit or AutoUpgradeRace or _G.AutoFarmMaterial or AutoRaceEvo1 or AutoSaber or _G.Autopole or _G.SwodCanvander or _G.DefendVolcano or _G.SailBoat or _G.Autoterrorshark or _G.KillShark or _G.KillPiranha or _G.KillFishCrew or _G.AutoQuestRace or _G.Dungeon or _G.AutoLawRaid or _G.Tweenfruit or ProjectTrialPro or _G.AutoMysticIsland or _G.TweenMGear or _G.Autosaw or _G.AutoNear or _G.AutoFarmFruits or _G.CollectBerry or _G.RipIndraKill or _G.FarmChocola or SoulGuitar or _G.AutoHolyTorch or _G.AutoGetTushita or _G.AutoYama or _G.AutoMobDragon or _G.AutoHydraTree or _G.TweenToKitsune or _G.AutoDooHee or _G.AutoAzuerEmber or _G.TweenVolcano or _G.Dungeon or _G.AutoLawRaid or _G.TweenFruit or _G.Grabfruit or _G.TeleportIsland or _G.TeleportNPC or _G.SafeMode or _G.AutoPlayerHunter or _G.AutoKillPlayer or _G.TeleportPly or _G.AutoQuestBoss or _G.AutoAllBoss or _G.AutoFarmLevelNew or _G.FarmSummer or _G.BossPain then
                enableNoclip()
                disableCollisions()
            else
                disableNoclip()
            end
        end)
    end
end)

-- Anti-idle
game:GetService('Players').LocalPlayer.Idled:connect(function()
    game:GetService('VirtualUser'):Button2Down(Vector2.new(0,0), workspace.CurrentCamera.CFrame)
    wait(1)
    game:GetService('VirtualUser'):Button2Up(Vector2.new(0,0), workspace.CurrentCamera.CFrame)
end)

print("Autofarm loaded. Set _G flags to enable features.")